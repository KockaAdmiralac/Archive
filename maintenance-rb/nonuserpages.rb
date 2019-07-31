require 'uri'
require 'httparty'

# Read generated list
File.open('lister.txt') do |f|
  $pages = f.readlines
end

# Define variables
$results = []
puts 'Wiki subdomain:'
$base_url = "http://#{gets.chomp}.wikia.com/api.php?action=query&prop=revisions&rvprop=user&rvlimit=1&rvdir=newer&titles=%s&format=json"

# Find page creator
def thread_main
  loop do
    page = $pages.shift
    if page and not page.include? '/'
      page = page.strip
      pages = JSON.parse(HTTParty.get($base_url % URI.escape(page, Regexp.new("[^#{URI::PATTERN::UNRESERVED}]"))).body, :symbolize_names => true)[:query][:pages]
      if pages
        p = pages[pages.keys[0]]
        if p
          revs = p[:revisions]
          if revs and revs.length > 0
            user = revs[0][:user]
            if "User:#{user}" != page and user != 'Wikia' and user != 'FANDOM' and user != '127.0.0.1'
              puts page
              $results << page
            end
          end
        end
      end
    elsif not page
      break
    end
  end
end

# Execute in 25 separate threads
24.times do
  Thread.new do
    thread_main
  end
end
thread_main

# Output
File.open('nonuserpages.txt', 'w+') do |f|
  f.write($results.join('\n'))
end

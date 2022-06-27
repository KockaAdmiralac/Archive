require 'uri'
require 'httparty'

# Method to find all pages from a namespace
# @param [Number] apfrom - Listing offset
def api_call(apfrom = nil)
  if(apfrom and $letter != apfrom[0])
    puts "# Currently at letter #{apfrom[0]}                          #"
    $letter = apfrom[0]
  end
  data = JSON.parse(HTTParty.get($base_url + (apfrom ? "&apfrom=#{URI.escape(apfrom, Regexp.new("[^#{URI::PATTERN::UNRESERVED}]"))}" : "")).body, :symbolize_names => true)
  $arr += data[:query][:allpages].map{|o| o[:title] }
  api_call(data[:"query-continue"][:allpages][:apfrom]) if(data[:"query-continue"])
end

# Method that goes through all the pages
# in the $arr and checks for redlinks
def thread_main
  # We'll do this in a loop until the list is finished
  loop do
    # Wrap this in a try-catch just in case
    begin
	  # Getting the name
	  name = $arr[$ind]
	  return if name.nil?
	  $ind += 1
	  # Getting the parsed page contents
	  body = JSON.parse(
	    HTTParty.get(
		  "http://community.wikia.com/api.php",
		  :query => {
		    :action  => "query",
		    :prop    => "revisions",
		    :titles  => name.strip.scrub,
		    :rvprop  => "content",
		    :rvparse => 1,
		    :format  => "json"
		  }
	    ).body,
	    :symbolize_names => true
	  )
	  pages = body[:query][:pages]
	  # Finding if the page has redlinks and which are they
	  split = pages[pages.keys[0]][:revisions][0][:"*"].split("<a href=\"/wiki/")
	  split.each {|s|
	    matches = /\?action=edit&amp;redlink=1" class="new" title="(.*) \(page does not exist\)"/.match(s)
	    $res << matches.captures[0] if matches
	  }
    rescue Exception => e
	  # If error happens I want to know
      puts(e)
    end
  end
end

# Defining variables
# TODO: This is shitty
$arr = []
$res = []
$ind = 0
$letter = ""

# Welcome
puts "#================================================#"
puts "#               REDLINK FINDER v1.0              #"
puts "#------------------------------------------------#"
puts "#               One to kill them all             #"
puts "#================================================#"
# Inputting the namespace to check on
puts "# Enter the namespace ID you want to check:      #"
$base_url = "http://community.wikia.com/api.php?action=query&list=allpages&aplimit=500&apnamespace=" + gets.chomp + "&apfilterredir=nonredirects&format=json"

# Finding pages
puts "# Listing all pages from the namespace...        #"
api_call

=begin
#================================================#
# Current # All     # Progress # Redlinks found  #
#================================================#
=end

# Log stuff
Thread.new {
  len = $arr.length
  loop {
    sleep(5)
    ind = "#{$ind}"
	per = "#{((($ind + 0.0) / $arr.length) * 100).round(2)}%"
	red = "#{$res.length}"
    #puts sprintf("# % 7d # % 7d # ")
  }
}

# Make 24 separate threads and then execute the same
# thing on the main thread so others don't die when
# main thread exits
24.times { Thread.new { thread_main } }
thread_main

# Dump results to file on exit
File.open("out.txt", 'w+') {|f| f.write($res.uniq.join("\n")) }
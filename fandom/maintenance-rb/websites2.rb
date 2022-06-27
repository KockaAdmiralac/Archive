require 'uri'
require 'httparty'

LAST_INDEX = 31697650
$res = []
$ind = 0

def thread_main
  loop do
    begin
	  return if $ind > LAST_INDEX
	  ind = $ind
	  $ind += 1 # fuck mutex
	  res = HTTParty.get("https://services.wikia.com/user-attribute/user/" + ind.to_s + "/attr/website")
	  if res
	    value = JSON.parse(res.body, :symbolize_names => true)[:value]
	    if value and value != ""
	      $res << "#{ind}: #{value}"
	    end
	  end
    rescue Exception => e
      puts(e)
    end
  end
end

Thread.new do
  loop do
    sleep(5)
    puts "#{$ind}/#{LAST_INDEX} [#{(($ind / LAST_INDEX) * 100).round / 100}%], #{$res.length}"
  end
end

Thread.new do
  loop do
    sleep(20)
	File.open('websites.txt', 'a') do |f|
	  f.puts $res.uniq.join("\n")
	  $res = [] # fuck mutex
	end
  end
end

24.times { Thread.new { thread_main } }
thread_main

File.open('websites.txt', 'a') do |f|
  f.puts $res.uniq.join("\n")
end
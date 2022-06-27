require 'uri'
require 'httparty'

$arr = []
File.open('forums.txt') {|f| $arr = f.readlines }

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
		  "http://reponses.wikia.com/api.php",
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
	  content = pages[pages.keys[0]][:revisions][0][:"*"]
	  $res << name if content =~ /je\s*ne\s*sais\s*pas/im
    rescue Exception => e
	  # If error happens I want to know
      puts(e)
    end
  end
end

# Defining variables
# TODO: This is shitty
$res = []
$ind = 0
$letter = ""

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
    puts "#{$ind}/#{$arr.length} [#{((($ind + 0.0) / $arr.length) * 100).round(2)}%] - #{$res.length}"
  }
}

# Make 24 separate threads and then execute the same
# thing on the main thread so others don't die when
# main thread exits
24.times { Thread.new { thread_main } }
thread_main

# Dump results to file on exit
File.open("out.txt", 'w+') {|f| f.write($res.uniq.join("\n")) }
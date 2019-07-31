require 'uri'
require 'httparty'

$arr = []
$res = []
$ind = 0
File.open("forums.txt") {|f| $arr = f.readlines }

def main
  loop do
    begin
	  page = $arr[$ind]
	  return if page.nil?
	  page = page.strip.scrub
	  $ind += 1
	  res = HTTParty.get(
	    "http://community.wikia.com/index.php",
		:query => {
		  :title => page,
		  :action => "raw"
		}
	  ).body
	  # ================== #
	  # here go conditions #
	  # ================== #
	  $res << page if res =~ /wikia/im
	  # ================== #
	rescue => e
	  puts e
	end
  end
end

Thread.new do
  loop do
    sleep 5
    puts "#{$ind}/#{$arr.length} [#{((($ind + 0.0) / $arr.length) * 100).round(2)}%]: #{$res.length}"
  end
end

24.times { Thread.new { main } }
main

File.open("forumsout.txt", 'w+') {|f| f.write($res.uniq.join("\n")) }
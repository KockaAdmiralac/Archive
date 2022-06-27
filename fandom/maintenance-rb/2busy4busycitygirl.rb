require 'httparty'

$wikis = []
$ind = 0
$res = []

File.open('wikis.txt', 'rb') {|f| $wikis = f.readlines }

Thread.new {
  loop do
    sleep 5
    puts "#{$ind}/#{$wikis.length} [#{$res.length}]"
  end
}

$wikis.each {|w|
  res = JSON.parse(HTTParty.get("http://#{w.strip}.wikia.com/api.php?action=query&list=usercontribs&ucuser=BusyCityGirl&format=json").body, :symbolize_names => true)
  if res and res[:query] and res[:query][:usercontribs] and res[:query][:usercontribs].length > 0
    $res.push(w)
	puts w
  end
  $ind += 1
}

File.open('omg.txt', 'w+') {|f| f.write($res.join) }
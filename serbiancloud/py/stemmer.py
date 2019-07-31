#-*-coding:utf-8-*-
#
#    Simple stemmer for Croatian v0.1
#    Copyright 2012 Nikola Ljubešić and Ivan Pandžić
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU Lesser General Public License as published
#    by the Free Software Foundation, either version 3 of the License, or
#    (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
#    GNU Lesser General Public License for more details.
#
#    You should have received a copy of the GNU Lesser General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.

import re
import sys
import os, inspect

stop = set(['biti','jesam','budem','sam','jesi','budes','si','jesmo','budemo','smo','jeste','budete','ste','jesu','budu','su','bih','bijah','bjeh','bijase','bi','bje','bjese','bijasmo','bismo','bjesmo','bijaste','biste','bjeste','bijahu','biste','bjeste','bijahu','bi','bise','bjehu','bjese','bio','bili','budimo','budite','bila','bilo','bile','cu','ces','ce','cemo','cete','zelim','zelis','zeli','zelimo','zelite','zele','moram','moras','mora','moramo','morate','moraju','trebam','trebas','treba','trebamo','trebate','trebaju','mogu','možes','moze','mozemo','mozete'])
currentdir = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))

rules = [re.compile(r'^(' + osnova + ')(' + nastavak + r')$') for osnova, nastavak in [e.strip().split(' ') for e in open(currentdir + '/rules.txt', encoding='utf-8')]]
transformations=[e.strip().split('\t') for e in open(currentdir + '/transformations.txt', encoding='utf-8')]

def highlightSpecialR(word):
	return re.sub(r'(^|[^aeiou])r($|[^aeiou])', r'\1R\2', word)

def hasVocal(word):
	if re.search(r'[aeiouR]', highlightSpecialR(word)) is None:
		return False
	else:
		return True

def transform(word):
	for key,repl in transformations:
		if word.endswith(key):
			return word[:-len(key)] + repl
	return word

def simplify(word):
	for rule in rules:
		mtch = rule.match(word)
		if mtch is not None:
			if hasVocal(mtch.group(1)) and len(mtch.group(1)) > 1:
				return mtch.group(1)
	return word
	
def stem(text):
	arr = []
	for token in re.findall(r'\w+', text):
		if token.lower() in stop:
			arr.append(token.lower())
			continue
		arr.append(simplify(transform(token.lower())))
	return " ".join(arr)
    
if __name__ == '__main__':
	if len(sys.argv) != 3:
		sys.exit(1)
	output_file = open(sys.argv[2], 'w')
	text = open(sys.argv[1]).read()
	output_file.write(stem(text))
	output_file.close()

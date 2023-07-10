from csv import DictWriter
from os import listdir
from os.path import isdir
from re import compile

filenames = []
QUESTION_REGEX = compile(r'^(\d+)\\?\.')

for dir in listdir('output'):
    dirname = f'output/{dir}'
    if not isdir(dirname):
        continue
    for file in listdir(dirname):
        if file.endswith('.txt'):
            filenames.append(f'{dirname}/{file}')

field_names = ['filename'] + [str(num) for num in range(1, 24)]

with open('result.csv', 'w', encoding='utf-8') as csv_file:
    writer = DictWriter(csv_file, fieldnames=field_names)
    writer.writeheader()
    for filename in filenames:
        with open(filename, 'r', encoding='utf-8') as file:
            questions = {}
            curr_question = '0'
            questions['0'] = ''
            for line in file:
                num_match = QUESTION_REGEX.match(line)
                if num_match:
                    curr_question = num_match.group(1)
                    questions[curr_question] = QUESTION_REGEX.sub('', line).strip()
                else:
                    questions[curr_question] += f' {line.strip()}'
            del questions['0']
            questions['filename'] = filename
            try:
                writer.writerow(questions)
            except:
                print('Error on', filename)

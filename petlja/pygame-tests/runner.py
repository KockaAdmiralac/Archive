from checker import Checker
from enums import CheckerEvent, CheckerResult
import asyncio
import json
import os
import re
import sys

class Runner():
    def __init__(self):
        self.parser = re.compile('^<pygame-to-runner nonce="([^"]+)">(.*)</pygame-to-runner>$')
        self.nonce = 'hmmm'
        self.checker = Checker()

    def run(self):
        self.loop = asyncio.get_event_loop()
        self.loop.run_until_complete(self.main())
        self.loop.close()
        print('CHECKER RESULT: {0}'.format(self.status))

    async def main(self):
        self.process = await asyncio.create_subprocess_exec(
            sys.executable,
            'script.py',
            stdin=asyncio.subprocess.PIPE,
            stdout=asyncio.subprocess.PIPE,
            stderr=sys.stderr,
            cwd=os.getcwd()
        )
        self.process.stdin.write(b'%b\n' % self.nonce.encode('ascii'))
        await self.process.stdin.drain()
        running = True
        while running:
            running = await self.read()
        status = await self.process.wait()
        print('Process exited with status {0}.'.format(status))
        if status == 0:
            if self.checker_result == CheckerResult.FAILED:
                self.status = 'FAIL'
            elif self.checker_result == CheckerResult.SUCCEEDED:
                self.status = 'OK'
            else:
                self.status = 'MISS'
        else:
            self.status = 'RTE'

    async def read(self):
        line = await self.process.stdout.readline()
        self.checker_result = CheckerResult.CONTINUE
        if line:
            data = line.decode('utf-8')
            match = self.parser.match(data)
            if match:
                if match.group(1) == self.nonce:
                    message = match.group(2)
                    print('Message: {0}'.format(message))
                    parsed = json.loads(message)
                    self.checker_result = self.checker.event(*parsed)
                else:
                    print('Invalid nonce: {0}'.format(match.group(1)))
            else:
                output = data.strip()
                print('Output: {0}'.format(output))
                self.checker_result = self.checker.event(CheckerEvent.OUTPUT, output)
            return self.checker_result == CheckerResult.CONTINUE
        else:
            return False

if __name__ == '__main__':
    runner = Runner()
    runner.run()

from pygments.lexer import RegexLexer
from pygments.token import Generic, Keyword, Name, Text

class MilokodLexer(RegexLexer):
    name = 'Milokod'
    aliases = 'milo'
    filenames = ['*.milo']
    flags = 0

    tokens = {
        'root': [
            (r'\b(if|for|while|end_if|end_for|end_while|in|do|then|return|to|else)\b', Keyword),
            (r'\b(and|or|not|nil)\b', Text),
            (r'^[A-Z-_ ][A-Z-_ ]+\(', Generic.Heading, 'heading'),
            (r'\b([a-z-_]+|[A-Z-_]{1,2})\b', Name)
        ],
        'heading': [
            (r'\b([a-z-_]+|[A-Z-_])\b', Generic.Emph),
            (r', ', Generic.Heading),
            (r'\)', Generic.Heading, '#pop')
        ]
    }


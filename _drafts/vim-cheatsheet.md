This is my Vim cheatsheet which I intend on updating as I incrementally learn the vast functionality of Vim. I've been using it for years but very basically. Having recently spent sometime helping out a team as a senior IC, one of the biggest gains you can make is improving your productivity.

## Primeagen Summary
### Video 2 *Foundation for Speed*
**Normal Mode**
- `SHIFT+I` beginning of line
- `SHIFT+A` end of line
- `*` next instance of what your cursor is on
- `#` previous instance of what your cursor is on
### Video 3 *Horizontal Speed*
**Normal Mode**
- `f+char` jump to character
- `t+char` jump up to character
- `;` cycle forward through results of ☝️
- `,` cycle backwards through results of ☝️
- `s` replace current char and enter *Insert* mode
- `cw` change word
- `dw` delete word
- `shift+d` delete rest of line
- `shift+s` delete entire line and enter *Insert* mode
- `shift+a` goto end of line and enter *Insert* mode
- `shift+a` goto end of line and enter *Insert* mode

### Video 4 *Vertical Domination*
- `line-number+gg`|`:+line-number` goto line-number
- `shift+a` goto end of line and enter *Insert* mode
-  `{` and `}` to navigate forwards and backwards through paragraphs of code
- `Ctrl + u` and `Ctrl + d` to jump half-page up and half-page down
- `%` jump to matching pair of curly braces, brackets, parentheses; but doesn't work on quotes



### Video 5

# Vim learning 
4. Type  0  (zero) to move to the start of the line.
  5. Now type a capital  U  to return the line to its original state.
6. Now type  u  a few times to undo the  U  and preceding commands.
7. Now type CTRL-R (keeping CTRL key pressed while hitting R) a few times
    to redo the commands (undo the undo's).
5. To go back to where you came from press  CTRL-O  (Keep Ctrl down while
    pressing the letter o).  Repeat to go back further.  CTRL-I goes forward. 
4. Type  %  to move the cursor to the other matching bracket.
4. To change every occurrence of a character string between two lines,
  type   :#,#s/old/new/g    where #,# are the line numbers of the range
                            of lines where the substitution is to be done.
  Type   :%s/old/new/g      to change every occurrence in the whole file.
  Type   :%s/old/new/gc     to find every occurrence in the whole file,
                            with a prompt whether to substitute or not.
2. Typing  /  followed by a phrase searches FORWARD for the phrase.
    Typing  ?  followed by a phrase searches BACKWARD for the phrase.


CTRL-O takes you back to older positions, CTRL-I to newer positions.

# Recommended resources
- [The Primeagen's youtube series]()
- Vimtutor

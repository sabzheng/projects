import tkinter as tk
from tkinter import font
from turtle import back #tk is the abbreviation of tkinker
#use font to tweak font of the game display

from typing import NamedTuple #a way to provide initial type hint information in your classes
from itertools import cycle

class Player(NamedTuple): #determines x or 0 and color corresponding
    label: str
    color: str

class Move(NamedTuple): #hold coordinates that identify the move's target cell
    row: int
    col: int
    label: str=""

BOARD_SIZE=3
DEFAULT_PLAYERS=(
    Player(label="X", color="blue"),
    Player(label="O", color="green"), 
)

class TicTacToeGame:
    def __init__(self, players=DEFAULT_PLAYERS, board_size=BOARD_SIZE):
        self._players = cycle(players) #cyclic iterator between input tupl of player
        self.board_size=board_size #board size
        self.current_player = next(self._players) #current player
        self.winner_combo = [] #combination of cells that defines  winner
        self._current_moves=[] #current move gives the list of players moves in a given game
        self._has_winner=False #determine if the game has a winner or not yet
        self._winning_combos=[] #list containing the cell combinations that define a win
        self._setup_board()

    def _setup_board(self):
        self._current_moves = [
            [Move(row,col)for col in range(self.board_size)] #empty move stores the coordinates of its containing cell and an empty string as the initial player's label
            for row in range(self.board_size)
        ]

        self._winning_combos =self._get_winning_combos()

# getting winning combos which is rows, cols, and diagonals
    def _get_winning_combos(self):
        rows = [
            [(move.row, move.col)for move in row]
            for row in self._current_moves
        ]
        columns = [list(col) for col in zip(*rows)]

        first_diagonal=[row[i] for i, row in enumerate(rows)]
        second_diagonal=[col[j] for j, col in enumerate(reversed(columns))]

        return rows+columns+[first_diagonal,second_diagonal]

    def toggle_player(self):
        """Return a toggled player."""
        self.current_player=next(self._players)

    def is_valid_move(self, move):
        """return true if move is valid and false otherwise"""
        row, col = move.row, move.col
        move_was_not_played=self._current_moves[row][col].label=="" #if no player has made the input mobe before
        no_winner=not self._has_winner #check no winner already exist
        return no_winner and move_was_not_played

    #if last player has won the game
    def process_move(self,move):
        """Process the current move and check if it is a win"""
        row,col=move.row,move.col
        self._current_moves[row][col]=move
        for combo in self._winning_combos:
            results = set(
                self._current_moves[n][m].label for n,m in combo
            )
            is_win=(len(results)==1) and ("" not in results)

            if(is_win):
                self._has_winner=True
                self.winner_combo=combo
                break
    
    def reset_game(self):
        """Reset the game state to play again."""
        for row,row_content in enumerate(self._current_moves):
            for col, _ in enumerate(row_content):
                row_content[col] = Move(row,col)
            self._has_winner=False
            self.winner_combo=[]

    def has_winner(self):
        """Return True if the game has a winner false otherwise"""
        return self._has_winner

    #check got tied game
    def is_tied(self):
        no_winner = not self._has_winner
        played_moves=(
            move.label for row in self._current_moves for move in row
        )
        return no_winner and all(played_moves)

class TicTacToeBoard(tk.Tk): #board class inherits from Tk
    def __init__(self,game): #self refers to tk.Tk/ constructor
        
        super().__init__() #super class is Tk. This call superclass's _init_() method to initialize the parent class
        
        self.title("Tic-Tac-Toe Game") #.title attribute of tk.Tk that defines the text to show on the window's title bar
        
        self._cells={} #.cells holds an initially empty dictionary
                        # this dictionary maps the buttons or cells on the game board

        self._game=game
        self._create_menu()
        self._create_board_display()
        self._create_board_grid()
        
    def reset_board(self):
        """Reset the game's board to play again"""
        self._game.reset_game()
        self._update_display(msg="Ready?")
        for button in self._cells.keys():
            button.config(highlightbackground="pink")
            button.config(text="")
            button.config(fg="black")


    #set a display that provide information about the game's state and result
    def _create_board_display(self):
        #inside you need to use a Frame widget as the display panel and a Label widget to show the required information
        
        #create a Frame object to hold game display
            #master is set to self = the game's main window will be the frame's parent
        display_frame = tk.Frame(master=self)

        #.pack to place frame object on the main window's top border
            #fill=tk.X ensure that when user resize the window the frame will fill its entire width
        display_frame.pack(fill=tk.X)

        self.display = tk.Label( #create a label object
            master=display_frame, #set label position onto display_frame
            text="READY?", #initially shpw READY
            font=font.Font(size=28, weight="bold"), #change font size and make it bold
        )

        #pack label 
        self.display.pack()

    def _create_board_grid(self):
        grid_frame = tk.Frame(master=self) #create frame obj to hold game's grid of cells
        grid_frame.pack()
        for row in range(self._game.board_size):#each row out of three
            self.rowconfigure(row,weight=1,minsize=50)
            self.columnconfigure(row,weight=1,minsize=75)
            for col in range(self._game.board_size): #each col out of three
                button = tk.Button(
                    master=grid_frame,
                    text="",
                    font=font.Font(size=36, weight="bold"),
                    fg="black",
                    width=3,
                    height=2,
                    highlightbackground="lightblue",
                    background="pink"
                )
                self._cells[button]=(row,col) #adds each button to the new ._cells dictionary
                button.bind("<ButtonPress-1>",self.play)
                button.grid( #add every button to the main window using .grid()
                    row=row,
                    column=col,
                    padx=5,
                    pady=5,
                    sticky="nsew"
                 )
    def _update_button(self,clicked_btn):
        clicked_btn.config(text=self._game.current_player.label)
        clicked_btn.config(fg=self._game.current_player.color)

    def _update_display(self,msg,color="black"):
        self.display["text"] = msg
        self.display["fg"] = color

    def _highlight_cells(self):
        for button, coordinates in self._cells.items():
            if coordinates in self._game.winner_combo:
                button.config(highlightbackground="red")
    
    def play(self,event):
        """Handle a player's move"""
        clicked_btn = event.widget
        row, col = self._cells[clicked_btn]
        move = Move(row, col, self._game.current_player.label)
        if self._game.is_valid_move(move):
            self._update_button(clicked_btn)
            self._game.process_move(move)
            if self._game.is_tied():
                self._update_display(msg="TIED GAME!", color="red")
            elif self._game.has_winner():
                self._highlight_cells()
                msg = f'Player"{self._game.current_player.label}" won!'
                color = self._game.current_player.color
                self._update_display(msg,color)
            else:
                self._game.toggle_player()
                msg = f"{self._game.current_player.label}'s turn"
                self._update_display(msg)
                print(self._game.current_player.label+"\n")

    def _create_menu(self):
        menu_bar=tk.Menu(master=self)
        self.config(menu=menu_bar)
        file_menu = tk.Menu(master=menu_bar)
        file_menu.add_command(
            label="Play Again",
            command=self.reset_board
        )
        file_menu.add_separator()
        file_menu.add_command(label="Exit",command=quit)
        menu_bar.add_cascade(label="File",menu=file_menu)

def main():
    """Create the game's board and run its main loop."""
    game=TicTacToeGame()
    board=TicTacToeBoard(game)
    board.mainloop()

if __name__=="__main__":
    main()

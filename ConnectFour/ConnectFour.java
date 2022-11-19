import java.util.Scanner;
public class ConnectFour {
    public static void main(String[]args){
        try (Scanner stdin = new Scanner(System.in)) {
            char[][]board = new char[6][7];
            GameBoard(board);
            char player='R';
            int position;
            boolean winner = false;

            if((int)(Math.random()*2)!=0)
                player='Y';
            int turn = 1;
            while(turn<=(board.length*board[0].length)){
                do {
                    if (player == 'R')
                        System.out.print("Player 1 drop a Red disk(R) (0-6): ");
                    else
                        System.out.print("Player 2 drop a Yellow disk(Y) (0-6): ");
                    position = stdin.nextInt();
                }while(!validEntry(position, board));

                display(board,position,player);
                winner=Winner(board,player);
                if(winner)
                    break;
                if(player=='R') {
                    player = 'Y';
                }
                else {
                    player = 'R';
                }
                turn++;
            }
            if(winner){
                if(player=='R')
                    System.out.println("PLAYER 1 (R) won!");
                else
                    System.out.println("PLAYER 2 (Y) won!");
            }
            else
                System.out.println("Tie game!");
        }
    }
    //checks for winner
    public static boolean Winner(char[][]board,char player) {
        for (int i = board.length - 1; i >= 0; i--) {
            for (int j = 0; j < board[i].length - 3; j++) {
                if (board[i][j] == player && board[i][j + 1] == player && board[i][j + 2] == player && board[i][j + 3] == player)
                    return true;
            }
        }
        for (int i = 0; i < board[0].length; i++) {
            for (int j = board.length - 1; j >= board.length - 3; j--) {
                if (board[j][i] == player && board[j - 1][i] == player && board[j - 2][i] == player && board[j - 3][i] == player)
                    return true;
            }
        }
        for (int i = board.length - 1; i >= board.length - 3; i--) {
            for (int j = 0; j < board[i].length; j++)
                if (board[i][j] == player && j <= 3) {
                    if (board[i - 1][j + 1] == player && board[i - 2][j + 2] == player && board[i - 3][j + 3] == player)
                        return true;
                } else if (board[i][j] == player && j >= 3) {
                    if (board[i - 1][j - 1] == player && board[i - 2][j - 2] == player && board[i - 3][j - 3] == player)
                        return true;
                }
        }
        return false;
    }
    //checks for valid entry
    public static boolean validEntry(int position, char[][]board){
        if(position<0||position>board[0].length-1){
            System.out.println("Enter a number from 0 to "+(board[0].length-1));
            return false;
        }
        if(board[0][position]!=0) {
            System.out.println("This column is full! Pick a different column");
            return false;
        }
        return true;
    }
    //set up the game
    public static void GameBoard(char[][]gridSize){
        for(int i=0; i<gridSize.length; i++){
            for(int j=0; j<gridSize[i].length; j++) {
                System.out.print("|   ");
            }
            System.out.println("|");
        }
        System.out.print(" ");
        for(int i=0; i<gridSize[0].length; i++)
            System.out.print("....");
        System.out.print(" ");
        System.out.println();
        for(int i=0; i<gridSize[0].length; i++)
            System.out.print("| "+i+" ");
        System.out.println("|");
    }
    //display game status
    public static void display(char[][]board,int position,char player){
        for(int i=board.length-1; i>=0; i--) {
            if (board[i][position] == 0) {
                board[i][position] = player;
                break;
            }
        }
        for (int i = 0; i < board.length; i++){
            for (int j = 0; j < board[i].length; j++) {
                if (board[i][j] == 0)
                    System.out.print("|   ");
                else
                    System.out.print("| " + board[i][j] + " ");
            }
            System.out.println("|");
        }
        System.out.print(" ");
        for(int i=0; i<board[0].length; i++)
            System.out.print("....");
        System.out.print(" ");
        System.out.println();
        for(int i=0; i<board[0].length; i++)
            System.out.print("| "+i+" ");
        System.out.println("|\n");
    }
}

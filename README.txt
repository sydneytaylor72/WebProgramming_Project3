Names: Sydney Taylor, Kenton Carrier
Description: A simple HTTP server in node.js. The server will attempt to serve out the requested URL. There are three options for 
what the server will do: UNLINK, attempts to remove the file; SIZE, attempts to determine the size of the file; FETCH, attempts to 
read the contents of the file. The accepted file extensions are .txt, .html, .mp3, and .jpg.

1. What happens if your random number generator picks a port number that a student already has allocated?
Be specific, include an error message.

    You can't even run the server, it gives the following error message: "Error! EADDRINUSE".
    This means the address of the server and port you're trying to use is already occupied
    by another system process.

2. What happens if your random number generator is incorrect and returns a number below 1024?
Again, be specific, include an error message.

   You will receive this permission denied error: Error! EACCES

3. Why, in a real world deployment with multiple, unknown users, would it be not very useful to use a random port for your server?

   Users need to be able to rely on a consistent address. If you randomly generate the port every time you start the program up,
users will have no way to know what port is being used.

4. How many lines of code (if any) would you need to add if you were told to add "mp4" to handle "video/mp4" file types?

   One line of code, as another element in the VALIDEXT array.

5. What would happen if a user1 requested a file:/SLOW/DISK/DIRECTORY/foo.html and user2 requested a different file:/FAST/SSD/bar.html
where your program took 20 seconds to read the first file and 1 second to read the second file? What would the perceived time to see
the complete contents of their file for each user if they sent their requests, user1 and user2 (1) second apart? What about user2 and
then user1 (1) second apart?

   Each request is asynchronous, so there wouldn't be any delay from waiting on another user. If there is any delay, it would be from 
their individual request.

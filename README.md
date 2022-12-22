# Pokemon Twitter Bot
This Twitter bot was made for an LMC2700 assignment. It performs randomized actions in set intervals, including tweeting, retweeting, following, replying, and more. 

## Project Setup
1. To set up the project on a Windows device, install [Node.js](https://nodejs.org/en/download/) and [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) if not installed already.

2. Navigate to the desired local folder through the command line and clone the repository:
    ```shell
    $ git clone https://github.com/18leij2/twitter-bot.git
    ```
    > Alternatively, [Github Desktop](https://desktop.github.com/) may be used to clone the repository.

3. Navigate to the newly cloned `twitter-bot` directory through the command line:
    ```shell
    $ cd twitter-bot
    ```

4. In the same directory, call the following command:
    ```shell
    $ npm install twit
    ```

5. Finally, open the file `config.js` and replace the placeholders for `consumer_key`, `consumer_secret`, `access_token`, and `access_token_secret`:
    ```shell
    module.exports = {
      consumer_key: 'placeholder',
      consumer_secret: 'placeholder',
      access_token: 'placeholder',
      access_token_secret: 'placeholder'
    }
    ```
    > The keys and secret values are kept hidden for security purposes and must be requested.

From this point onwards, calling the `$ node bot.js` command anytime when in the project directory should run the Twitter bot. The bot will continue running and automatically perform an action every set interval. To terminate the bot, hit `Ctrl+C` in the command prompt.

## Contributors
Jason Lei\
Victoria Nguyen\
Anna Everly\
Mansi Gupta

# Dubtrack Bot Commands #

## Cooldown ##
Each command has a cooldown; that means once someone has used it, you can't use it until a specific time amount has happend. Also it's important to know that to the cooldown mentioned below it's added a 'global cooldown' value defined in the bot's configuration.

## Attributes ##
#### > Target ####
**Description:** Used to specify an user, this user will be mentioned (in most commands) instead of user who sent the message.

**Usage:** as command argument: 't:{target}'

## List ##
- '/' is used as 'OR'. Ex.: 'command-alias/commandalias' which means you can use command-alias or commandalias and both will do the same.
- An argument inside curly brakets indicates that you replace the argument with a value shown inside the curly brakets. Ex.: '!command {number}' -> !command plus a number (0, 1, 2, 3, 4, 5, etc.)
- An argument inside parentheses indicates that the argument is optional.
- Spaces indicate a new argument.
- The staff rank indicates users with rank equal or higher than mod.
- Cooldown is in miliseconds (1/1000 of a second). Default global cooldown is 5000 (5 seconds)
- Default command prefix is '!'. That can be changed on the bot settings but the list below will show commands with that prefix.

|               Name              |                                Arguments                               |                                              Description                                             |     Rank    | Cooldown |
|:-------------------------------:|:----------------------------------------------------------------------:|:----------------------------------------------------------------------------------------------------:|:-----------:|:--------:|
|             bot/help            |                                   N/A                                  | Display description about the bot.                                                                   |     All     |     0    |
|              howto              |               queue/vote/grab/volume/ ping/sendimage/css               | Display useful guides for new users.                                                                 |     All     |     0    |
|              whois              |                     {streamer}/{botname}/{username}                    | Displays information about a user.                                                                   |     All     |     0    |
|          getlink/linkto         | song/rules/dubx/css(2)/ gifeditor/plugdjexporter/ dubtrackimporter/dte | Show link to a predefined option (rules, dubx, css, etc...)                                          |     All     |     0    |
|   staffonline/mods/modsonline   |                                   N/A                                  | Displays what staff users are online in the room.                                                    |     All     |     0    |
|     botoptions/botproperties    |                            {option} {value}                            | Define settings for the bot to use.                                                                  |    Staff    |    N/A   |
|          sayhi/salutate         |                                (fromme)                                | Make the bot say salutate to someone.                                                                |     All     |   20000  |
|          songinfo/song          |                                dubs/link                               | Get information about the current song.                                                              |     All     |   30000  |
|              rules              |                                   N/A                                  | Abreviation command for '!getlink rules'                                                             |     All     |     0    |
|     oplist/op-list/blacklist    |                                   N/A                                  | Abreviation command for '!getlink oplist'                                                            |     All     |     0    |
|             songlink            |                                   N/A                                  | Abreviation command for '!song link'                                                                 |     All     |   30000  |
|              getid              |                              {user}/*song                              | Display any user's id or the current song's id.                                                      |    Staff    |    N/A   |
|              ishere             |                                 {user}                                 | Display if a user is currently on the room.                                                          |     All     |   5000   |
| eta/estiatestimeofarrival/booth |                                   N/A                                  | Display aproximate time for selected user to reach DJ status in the room.                            |     All     |   10000  |
|         8ball/magicball         |                               {question}                               | Ask the bot a yes or no question and it'll answer.                                                   |     All     |   10000  |
|  delall/deleteall/deleteallchat |                                 {user}                                 | Deletes all chats from a specific user.                                                              |    Staff    |    N/A   |
|             whatfor             |                                {command}                               | Displays the function of a bot command.                                                              |     All     |     0    |
|       streamstatus/stream       |                                   N/A                                  | Check if streamer is currently streaming.                                                            |     All     |     0    |
|          skip/skipsong          |                 {reason}/id:{songid} {reason}/{songid}                 | Smart skip the current song or a song by id. Optional make the bot display why the song was skipped. |    Staff    |    N/A   |
|        emoticon/em/emote        |                                 {emote}                                | Display the image of a specific Twitch Emoticon.                                                     | Resident-DJ |     0    |
|      urban/urbandictionary      |                              {term} (i:{index})                             | Display a search for a term in Urban Dictionary.                                                     | Resident-DJ |   10000  |

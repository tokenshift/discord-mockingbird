# Mockingbird

Discord bot that you can "teach" new commands and responses to on the fly.

Authorization URL: [click here](https://discord.com/api/oauth2/authorize?client_id=819993941067694141&permissions=0&scope=bot%20applications.commands)

## Usage

Learn a new command:

```
/learn tavern The Fighting Eider
> Learned "tavern".
```

Then you can use `/tavern` to get an automated response:

```
/tavern
> The Fighting Eider
```

All commands and responses are specific to the server where they're added.

You can teach Mockingbird multiple responses to the same command, and it'll pick
a random response each time. If you add the `-n {number}` flag, you can pick a
specific response instead:

```
/learn tavern The Fighting Eider
Learned "tavern".
/learn tavern Three Sleeping Oxen
Learned "tavern".
/list tavern
1: The Fighting Eider
2: Three Sleeping Oxen
/tavern -n 2
Three Sleeping Oxen
```

The `/list {command}` command will display all responses known for a given
command.

You can use `/unlearn` to remove commands & responses from Mockingbird's memory:

```
/list tavern
1: The Fighting Eider
2: Three Sleeping Oxen
/unlearn tavern 1
Consider it gone.
/list tavern
1: Three Sleeping Oxen
```

If there's only one response known, then the `-n {number}` flag is unnecessary.
If you want to unlearn ALL responses to that command, add the `-a|--all` flag.

You can use the `/list {command}` command to list all responses currently known
for a given command:

```
/list tavern
> 1: The Fighting Eider
> 2: Three Sleeping Oxen
```
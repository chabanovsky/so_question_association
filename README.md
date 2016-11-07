# Cross-Site Association of Questions

This is a small chrome extension that should demonstrate basic ideas of [a proposed](http://meta.ru.stackoverflow.com/questions/2983/) feature for Stack Overflow.

## How to install

Follow [Google's instruction](https://developer.chrome.com/extensions/getstarted#unpacked) to install the extension.

## What does extension do?

It works on two sides:

 1. Adds a special banner to "associated" questions, that says that there are more answers on Stack Overflow in Russian
 2. Adds an action to user tools that allows one associates a question between Stack Overflow in Russian and Stack Overflow in English. _Note: It actually does nothing! There is no association, all associated questions are hardcoded in the code!_
 
## Since associated question are hardcoded, where can I test it?
 
 List of question's ids
 
    SO En    | SO Ru
    ---------------------
    3211771  | 519913
    21573405 | 519562 
    18225126 | 519283
    950087   | 518486
    63447    | 518064
    162304   | 517684
    426258"  | 517241
    1783405  | 516889
    419163   | 515852
    1125968  | 515435
    1085801  | 513017
    2906582  | 512862
    38549    | 512193
    60174    | 511895
    218384   | 511085
    3988788  | 510755
 
## Pics
 
### Stack Overflow in English
 
If a question has an associated one and a user, who came to Stack Overflow in English, uses a browser with Russian language, we show they a spacial banner that says that there are more answers in Russian (Note: the phrase should be in Russian. It's in English here because otherwise nobody understands). 
 
 ![](http://i.stack.imgur.com/vb8eC.png)
 
If the user clicks on the "Show Answers" button, the extension uploads the best answer from the associated question and add it to the page. It's very important to show the content right here instead of asking the user go to to another site.
 
 ![](http://i.stack.imgur.com/aZDCD.png)
 
Under the uploaded answer there is a button and if the user clicks on it, the site redirects they to Stack Overflow in Russian. Additionally we may add a checkbox there, which will say "load associated answers from Stack Overflow automatically".
 
 ![](http://i.stack.imgur.com/tsx8q.jpg)
 
 
### Stack Overflow in Russian
  
If a question has an associated one we add a note in the sidebar, right above the "Linked" questions section.

 ![](http://i.stack.imgur.com/Jl6Ax.jpg)
 
Every question on Stack Overflow in Russian should have a new user tool – "associate".

![](http://i.stack.imgur.com/bNwTf.jpg)

If a user clicks on the associate they will see a kind of close menu that allows to search for questions to associate on Stack Overflow in English.

![](http://i.stack.imgur.com/JDmWR.png)

Additionally to the menu, it'd be nice to have a way to add association thought markdown, in question's body.

![](http://i.stack.imgur.com/LoOWy.jpg)


## Suggest your ideas! 
 
This is just basic things! Let's play with the extension and add new features to it!

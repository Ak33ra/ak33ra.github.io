let intro1 = `For nearly three decades, Egypt has been under the rule of President Hosni Mubarak, nicknamed "the Pharaoh".

The presidency that began with quiet acceptance soon turned into an authoritarian regime. Freedom of press was soon restricted as Mubarak was elected time and time again without opposition. 

With Egypt's economy in a downward spiral, policies involving foreign lenders further crippled you, the common people, financially. Your voices were suppressed by the government, and a growing income disparity strained tensions between the rich and poor. 

Not to mention, terrorism is prevalent, exacerbating both internal and external issues. As political opposition continues to be suppressed, unrest spreads through the population. However, it's been years under Mubarak's iron fist. Is change really possible?

Type **NEXT** to continue`

let intro2 = `One day, an answer arrives on your doorstep. 

At your home in Cairo, you watch the aftermath of the news that just arrived from Tunisia: mass protests have forced long time dictatorial President Zine al-Abidine Ben Ali to flee his country. 

Egyptians everywhere wonder, "could this set a precedent?" Social media buzzed with the sentence "the answer is Tunisia," but it's hard to believe that such a thing could happen here. You wonder if change is possible. If someone called for revolution, would the rest of Egypt answer?

What will you do?

**1:** Rush out to the streets of Cairo, showing your fervent revolutionary spirit
**2:** Post on social media, telling people to post Mubarak complaints with the hashtag OutWithMubarak
**3:** Encourage protestors to flood the streets holding jasmine flowers or wearing white as a nod to Tunisia's Jasmine Revolution
**4:** Gather a bunch of your friends to see what they think
`

const Disk = {
    roomId: 'intro1', // the ID of the room the player starts in
    rooms: [
        {
            id: 'intro1',
            desc: intro1,
            commands: `NEXT: go to the next stage`,
            //callback for Next command, used here to change displayed text
            onNext: () => {
                enterRoom("intro2");
            },
        },
        {
            id: "intro2",
            desc: intro2,
            commands: `1: choose option 1
            2: choose option 2
            3: choose option 3
            4: choose option 4`,
            //when enter an option
            on1: () => {
                enterRoom("op1")
            },
            on2: () => {
                enterRoom("op2")
            },
            on3: () => {
                enterRoom("op3")
            },
            on4: () => {
                enterRoom("op4")
            }
        },
        {
            id: "op1",
            desc: `A surprising number of people are quick to swarm the streets and chaos breaks out. Police are quick to beat and tear gas the protestors, and amid the confusion, clashes between protestors lead to even more injuries and deaths.
            
            Emboldened by your countrymen and ready to oust Mubarak, you rush onto the streets of downtown Cairo, ready to give your life for your country. 
            
            You brave the tear gas and clubs, showing no fear towards the policemen who are so desperate to stop you. You enter a trace, seemingly watching yourself from above the chaos, when suddenly, you trip and fall. 
            
            Showing no regard for your safety, your fellow protestors trample you underfoot. 
            
            It seems that you'll have to observe the results of this movement from the afterlife.. if there is one.
            
            **You died.**
            
            Post-game review: Honestly, you just got unlucky. Sorry.
            
            Type **RESTART** to try again`
        },
        {
            id: "op2",
            desc: `Your social media posts, and those of other ambitious citizens, are met with swift response. Negative posts about Mubarak from all with internet access spread quickly, but the situation in Egypt remains rather calm. 
            
            The posts are many, but action is relatively nonexistent. How can you convert social media presence into tangible change?
            
            **1:** Continue the social media campaign, demanding Mubarak's resignation
            **2:** Encourage a riot at a nearby police building`,
            commands: `1: choose option 1
            2: choose option 2`,
            on1: () => {
                enterRoom("op21")
            },
            on2: () => {
                enterRoom("op22")
            }
        },
        {
            id: "op3",
            desc: `Your idea gains some traction, and certain protestors fill the streets peacefully, wearing white or holding the flower. However, this represents a small fraction of the protestors flooding downtown Cairo. 
            
            The police are quick to use force, and chaos ensues, resulting in numerous injuries and deaths. You decide that unifying the protestors into one movement is necessary, but using a foreign movement's symbol might not work.
            
            Instead, you call your friends to brainstorm. As a joke, you suggest to start a movement with Mubarak's face on a cow's body. Cause (Mu)barak.. (Moo)barak.. 
           
            Anyways, your friends love it, and quickly get to work designing the logo, thinking it'll be funny to spread should protests continue. What do you do with this logo?
            
            **1:** Post it on social media. Lol.
            **2:** Print it and post it around the city
            **3:** BOTH! DUH!`,
            commands: `1: choose option 1
            2: choose option 2
            3: choose option 3`,
            on1: () => {
                enterRoom("op41")
            },
            on2: () => {
                enterRoom("op42")
            },
            on3: () => {
                enterRoom("op43")
            }
        },
        {
            id: "op4",
            desc: `As protestors swarm the streets and violence breaks out, you meet with your friends in one of their basements, discussing your thoughts about the current situation. 
            
            It's clear that revolutionary sentiment is widespread, but you all agree that it might be more effective if it were somehow unified and channeled. 
            
            As a joke, you suggest to start a movement with Mubarak's face on a cow's body. Cause (Mu)barak.. (Moo)barak.. 
           
            Anyways, your friends love it, and quickly get to work designing the logo, thinking it'll be funny to spread should protests continue. What do you do with this logo?
            
            **1:** Post it on social media. Lol.
            **2:** Print it and post it around the city
            **3:** BOTH! DUH!`,
            commands: `1: choose option 1
            2: choose option 2
            3: choose option 3`,
            on1: () => {
                enterRoom("op41")
            },
            on2: () => {
                enterRoom("op42")
            },
            on3: () => {
                enterRoom("op43")
            }
        },
        {
            id: "op21",
            desc: `You, and many other Egyptians, continue to post about Mubarak's corruption on social media. Despite heated action online, the country remains rather still, even complacent. 
           
            This carries on for several days. You begin to think that escalating the situation might be necessary, when Mubarak appears on national television. 
           
            He promises to delegate additional powers to the Vice-President and his cabinet, and place restrictions on the number of terms that can be served in office.
            
            Type **NEXT** to continue`,
            onNext: () => {
                enterRoom("op21-1")
            }
        },
        {
            id: "op21-1",
            desc: `You're beyond surprised, but the people rejoice, glad for the swift response and praising Mubarak for finally listening to the people. Any anger seems to have dissipated. 
                   
            Of course, Mubarak's promises are empty ones, and nothing really changes. You try desperately to spread this fact, clinging to any remaining revolutionary sentiment among Egyptians. 
            
            Unfortunately though, any further action on your part would be like trying to eat soup with a fork.
        
            You got outplayed by Mubarak.
        
            Type **NEXT** to continue`,
            commands: `NEXT: go to the next stage`,
            onNext: () => {
                enterRoom("op21-2");
            }
        },
        {
            id: "op21-2",
            desc: `Post game review: 
            
            Social media can certainly be a powerful tool for changemakers, but social media activity on its own rarely leads to substantial change. 
                    
            In this case, it might have better been used to spread the word of real life protests. 
            
            By relying on social media, you failed to gain tangible leverage and support and capitalize on a critical opportunity that came your way from Tunisia. 
           
            Mubarak recognized that people were eager for reform, and would be all too happy to accept a quick resolution.
            
            Type **RESTART** to try again`
        },
        {
            id: "op22",
            desc: `A fair amount of young people heed the call, and arrive in front of the local police station armed. Your group attacks. Windows break, someone starts a fire, but police quickly swarm out of the building and start retaliating. 
           
            Your group is no match for the organized police and is quickly driven out. Mubarak uses this event to impose a curfew and double the amount of police patrolling the streets. Gatherings are also limited to no more than four people. 
            
            Breaking either of these rules is enough to designate someone as a terrorist and use heavy-handed punishment. In addition, internet access is cut off. 
            
            The people are scared, revolutionary fervor seems to have died down, and people are afraid to fight back. Fear of the regime is at an all time high. 
            
            How can you turn the situation around?
            
            **1:** By word of mouth, have your group start asking people to wear white as a sign of quiet affirmation of their desire for change
            **2:** Create a funny picture, perhaps of Mubarak's head combined with a cow's body, 'cause (Mu)barak.. (Moobarak). Haha. Make printed copies to post around the city`,
            commands: `1: choose option 1
            2: choose option 2`,
            on1: () => {
                enterRoom("op221")
            },
            on2: () => {
                enterRoom("op222")
            }
        },
        {
            id: "op41",
            desc: `You and your friends all post your Cow-Mubarak design on social media, and it goes viral, earning attention not only from your fellow Egyptians but also some Westerners, though they are unaware of why this image was created. 
            
            Some fans print out the design and start pasting it around their cities, and it quickly becomes a national sensation.
            
            Type **NEXT** to continue`,
            commands: `NEXT: go to the next stage`,
            onNext: () => {
                enterRoom("op41-1");
            }
        },
        {
            id: "op41-1",
            desc: `Your social media account is quickly identified as the originator of the photo, and as demonstrations calm down, people are quick to follow your account. 
            
            Hey, maybe luck is on your side. That was pretty easy! You went from a nobody to a national sensation, and Moobarak has become the symbol of change in Egypt. 
            
            Either way, you recognize that this is a significant opportunity that should not be wasted.
            
            **1:** Organize a peaceful gathering in downtown Cairo
            **2:** Start another riot`,
            commands: `1: choose option 1
            2: choose option 2`,
            on1: () => {
                enterRoom("op421")
            },
            on2: () => {
                enterRoom("op422")
            }
        },
        {
            id: "op42",
            desc: `Numerous protestors around Cairo laugh at the cowified Mubarak, and some teens snap pictures. You see this pop up, going viral all over social media. 
            
            Pretty soon, cow Mubarak is a national sensation, and some Westerners have even taken notice even though they don't know the reason behind the photo. People of all walks of life, including business owners that benefit from Mubarak's rule, laugh at the image.
            
            Type **NEXT** to continue`,
            commands: `NEXT: go to the next stage`,
            onNext: () => {
                enterRoom("op41-1");
            }
        },
        {
            id: "op43",
            desc: `Protestors all around Cairo stop to laugh at the cowified Mubarak, and your social media posts soon go viral. Many western teens also take notice, spreading the funny picture, even though they are yet unaware of its origins.
            
            Type **NEXT** to continue`,
            commands: `NEXT: go to the next stage`,
            onNext: () => {
                enterRoom("op41-1");
            }
        },
        {
            id: "op221",
            desc: `You wake up the next day and head out in your white clothes to go buy breakfast. Each time you see someone wearing white, you quietly acknowledge them. Perhaps a nod, or a wave. 
            
            Sometimes, you receive only a confused look in return. But most of the time, the other person returns your gesture knowingly. By the day, the number of people wearing white grows exponentially, until no other color can be seen.
          
            It's clear to all that everyone wants Mubarak gone. How can you continue to improve the peoples' morale?
            
            **1:** Create a funny picture, perhaps of Mubarak combined with a cow. Moobarak. Make printed copies to post around the city.
            **2:** Set up a demonstration in the square... using children's toys.`,
            commands: `1: choose option 1
            2: choose option 2`,
            on1: () => {
                enterRoom("op222")
            },
            on2: () => {
                enterRoom("op2212")
            }
        },
        {
            id: "op222",
            desc: `You and your friends create a funny character, an animal with a cow's body and Mubarak's head, named Moobarak. In the dead of night, you sneak out, and post the pictures around the city. 
            
            The next morning, the normally silent roads are buzzing with chatter, and groups surround the posters as police hurry to take them down. Giggles escape here and there, but the police can't do anything about it. 
            
            You've succeeded at somewhat lightning the peoples' mood. What next?
            
            **1:** Release chickens with Moobarak pictures attached to their bodies
            **2:** Create a comic strip of Moobarak encouraging violent protest and post it around the city`,
            commands: `1: choose option 1
            2: choose option 2`,
            on1: () => {
                enterRoom("op2221")
            },
            on2: () => {
                enterRoom("op2222")
            }
        },
        {
            id: "op421",
            desc: `You encourage a peaceful gathering in order for the community to be together and share experiences. A large number of people show up, from children and their families to elderly, and even prominent businesspeople who seem to have a bone to pick with Mubarak. Many show up with Moobarak posters, and others with slogans like "Mubarak no more". 
           
            Everything seems to be going well, and you begin to give a talk about proper nonviolent protest, when suddenly police and Mubarak supporters show up. 
            
            They start firing rubber bullets and tear gas, hoisting posters in support of Mubarak. The unarmed anti-Mubarak group flees, and certain people post recordings of the whole ordeal. 
           
            The international community is enraged at the clear, unprovoked violence, by Mubarak supporters, which clearly violates their identity as self-proclaimed upholders of democracy and justice.
            
            **1:** Try to capitalize on the situaion with social media and start a change.org petition
            **2:** Start a social media campaign asking for international aid for Egypt's citizens`,
            commands: `1: choose option 1
            2: choose option 2`,
            on1: () => {
                enterRoom("op4211")
            },
            on2: () => {
                enterRoom("op4212")
            }
        },
        {
            id: "op422",
            desc: `You encourage more violence in the streets of Cairo, saying death is better than continuing to live under Mubarak. 
            
            The frenzied people once again fill the city, and the police are once again called to suppress the revolt. Naturally, violence and chaos ensue, and the military soon arrives. 
            
            They put forth an ultimatium: either leave or die. 
            
            When the protestors extend their stay, you expect that the tanks will prompty start their advance, but by some stroke of sheer luck, many soldiers' faces actually show hesitancy. 
            
            You call for a retreat, knowing that a fight against such firepower is impossible, but with the knowledge that the military might not be as polarized as the police. What next?
            
            **1:** Capitalize on the military's hesitancy! Call for an ARMED riot!
            **2:** Call for a peaceful gathering`,
            commands: `1: choose option 1
            2: choose option 2`,
            on1: () => {
                enterRoom("op4221")
            },
            on2: () => {
                enterRoom("op4222")
            }
        },
        {
            id: "op2212",
            desc: `People might get arrested for protesting, but toys won't. You gather as many old stuffed animals as you can, and equip them with anti-Mubarak signs. At night, you set them up in the city square for all to see. 
            
            The next morning, you hear rare commotion in the streets, and the source is none other than the toys you placed the night before. 
            
            People have gathered around the display, snapping pictures and sharing a laugh, and for the first time in a while, the city's mood is light. 
            
            **1:** Call for a peaceful gathering at the presidential palace
            **2:** Encourage another violent protest`,
            commands: `1: choose option 1
            2: choose option 2`,
            on1: () => {
                enterRoom("op22121")
            },
            on2: () => {
                enterRoom("op22122")
            }
        },
        {
            id: "op2221",
            desc: `You decide to buy several live chickens, asking your friends to do the same and to bring them to your house later. When you gather, you explain your plan of taping Moobarak pictures to them. 
            
            Maybe something funny might ease the peoples' hearts. Also, if the police chase the chickens to remove Moobarak pictures, the people might have a good laugh and remember that police are only human. 
            
            If the police do nothing, well, who doesn't love free publicity?

            Type **NEXT** to continue`,
            commands: `NEXT: go to the next stage`,
            onNext: () => {
                enterRoom("op2221-2");
            }
        },
        {
            id: "op2221-2",
            desc: `Early the next morning, you and your friends release the Moobarak chickens. Later, you walk outside, seeing the chaos unfold. 
            
            All around the neighborhood, police are chasing frightened chickens with pictures of Moobarak on them. Some people have started throwing the printed posters from their balcony as well, and papers occasionally fall in the eyes of police, making them flail their arms. 
            
            Onlookers stream the event to social media, and in just a few minutes, the police have gone from the objects of fear to being national laughingstock.
            
            From here, you decide to continue peaceful protest, gathering larger crowds and advancing on the presidential palace day by day. You call forth a prominent Mubarak opposition candidate and plan for his removal from office. 
            
            Mubarak decides to flee the country, making way for a new government. 

            Type **NEXT** to continue`,
            commands: `NEXT: go to the next stage`,
            onNext: () => {
                enterRoom("op2221-3");
            }
        },
        {
            id: "op2221-3",
            desc: `**You won!**
            
            Post game review:
            
            Gathering support on social media to organize a protest was a good idea, and using humor to lessen fear of the police worked well. Continuing with this momentum kept the odds in your favor, eventually driving Mubarak out of office. 
            
            Type **RESTART** to play again or **QUIT** to return to the home page`
        },
        {
            id: "op2222",
            desc: `Sensing opportunity, you scramble to create a provoking comic involving your new character, sliding it into mailboxes and paste it on doors around the city. 
            
            You leave your house the next morning, ready to see masses of people gathered, but instead you see police rounding up anybody with a comic strip on their door or in their mail. 
            
            Everybody looks frightened, and naturally, they condemn the comics and their creator. Mubarak uses the comics as a reason to tighten emergency laws. 
            
            In a night, Moobarak went from national hope to the subject of hate. After a decision like that, I think you should just give up.
            
            Type **NEXT** to continue`,
            commands: `NEXT: go to the next stage`,
            onNext: () => {
                enterRoom("op2222-1");
            }
        },
        {
            id: "op2222-1",
            desc: `You lost, but at least you're alive I guess.
            
            Post game review:
            
            Gathering support on social media to organize a protest was a good idea, and using humor to lessen fear of the police worked well. 
            
            However, you might have been a little too eager for blood, and even this small misstep was capitalized on by the opposition.
            
            Type **RESTART** to play again or **QUIT** to return to the home page`
        },
        {
            id: "op4211",
            desc: `You start a petition on change.org for international organizations to halt foreign aid for Mubarak's government, and supply necessities to the heavily impoverished Egyptian population. 
            
            The petition goes viral, gaining countless signatures and making people feel good that they've been able to make a difference. After that though, nothing really happens. 
            
            The sting of the earlier violence starts to fade, and really, international tensions return to normal, with Mubarak still receiving his stream of cash from foreign lenders.
            
            Type **NEXT** to continue`,
            commands: `NEXT: go to the next stage`,
            onNext: () => {
                enterRoom("op4211-1");
            }
        },
        {
            id: "op4211-1",
            desc: `Eventually, Mubarak appears on national television, saying that he hears the peoples' concerns, and promises to delegate additional powers to his Cabinet and place a limit on the number of terms that can be served by the president.
            
            The people rejoice, thinking they have been successful. 
            
            In reality though, these promises were nothing more than smoke and mirrors. Mubarak simply took the opportunity you presented him when you decided to focus your efforts purely on social media activity. 
            
            The people are happy, even though nothing has changed. The revolution is over.
            
            Type **NEXT** to continue`,
            commands: `NEXT: go to the next stage`,
            onNext: () => {
                enterRoom("op4211-2");
            }
        },
        {
            id: "op4211-2",
            desc: `You lost.
            
            Post game review:
            
            Initially, you didn't do too bad. You unified the movement that came after Tunisia's success with a funny logo, before capitalizing on the government's oppression. 
            
            From there though, things went downhill. It was a mistake to veer away from real action and turn towards the internet and simply wait for help to arrive from elsewhere. 
            
            You had people ready to be out on the frontlines, with significant momentum due to Tunisia's situation. All of this was wasted on slacktivism, and gave Mubarak a chance to turn the tables.
            
            Type **RESTART** to play again or **QUIT** to return to the home page`
        },
        {
            id: "op4212",
            desc: `Many take notice of the mistreatment of Egypt's population, and soon, several organizations promise to bring supplies to the poorest Egyptians. 
            
            The UN releases a statement saying that oppression by the Egyptian government cannot go ignored, and superpowers like the U.S. say that democracy must be upheld. 
            
            Noticing the shift in opinions, international lenders cut off their deals with Mubarak, leaving his economically struggling country in dire straits.
            
            **1:** Call for a workers' strike
            **2:** Wait for international aid to arrive
            **3:** Continue peaceful demonstrations`,
            commands: `1: choose option 1
            2: choose option 2
            3: choose option 3`,
            on1: () => {
                enterRoom("op42121");
            },
            on2: () => {
                enterRoom("op42122");
            },
            on3: () => {
                enterRoom("op42123");
            }
        },
        {
            id: "op4221",
            desc: `You encourage the people to return to the streets, armed with whatever they could find. Enraged at the earlier humiliation, a strong showing of people, mostly young to middle aged, gathers up in the city. 
            
            Richer people who benefit from the regime and believe violence to be distasteful frown at your actions. 
            
            Nonetheless, the group is emboldened by the military's earlier hesitancy, and manages to crack open a few police heads, but the military quickly arrives and opens fire with their full might, this time showing no hesitation. 
            
            All who were present died quickly. The whole situation was captured on video, but since the people incited the violence, the international community barely takes notice. 
            
            This event, which will come to be known as the Cairo Massacre, strikes fear into the hearts of all Egyptians, killing all revolutionary fervor. The movement has failed. 
            
            Type **NEXT** to continue`,
            commands: `NEXT: go to the next stage`,
            onNext: () => {
                enterRoom("op4221-1");
            }
        },
        {
            id: "op4221-1",
            desc: `You died.
            
            Post game review:
            
            Your choices failed to take into account the peoples' strengths and weaknesses when compared to Mubarak. 
            
            How could armed citizens fight against organized military? Even if that hadn't resulted in instant defeat, how would you regain the support of the businesspeople you just turned away? The international community? The elderly? 
            
            All in all, this was a complete tactical failure, except for your short humor campaign.
            
            Type **RESTART** to play again or **QUIT** to return to the home page`
        },
        {
            id: "op4222",
            desc: `You take a gamble, encouraging the people to gather one again, this time unarmed. You encouraging people of all ages and classes to come, stating that Egypt needs to continue to build a sense of community. 
            
            Many people show up, including the police and military. Elderly pass around baked goods, and young children go around giving jasmine flowers to clearly uncomfortable military and police personnel. 
            
            You watch anxiously, hoping you aren't wrong about what you're about to do.
            
            Type **NEXT** to continue`,
            commands: `NEXT: go to the next stage`,
            onNext: () => {
                enterRoom("op4222-1");
            }
        },
        {
            id: "op4222-1",
            desc: `With a deep breath, you walk up to the general, asking where the military stands. 
            
            The general is silent for a moment, before telling you that it is the military's job to protect the people, and that it will continue to do so. 
            
            The military promises that it shall not use armed violence against protestors, and prevent the police from doing the same.
            
            **1:** Continue peaceful protest
            **2:** Ask the military to help you stage a coup`,
            commands: `1: choose option 1
            2: choose option 2`,
            on1: () => {
                enterRoom("op42221");
            },
            on2: () => {
                enterRoom("op42222");
            }
        },
        {
            id: "op22121",
            desc: `The people are nervous, but emboldened, and a large group gathers near the presidential palace. International guests happen to be there at the time, so the police are hesitant to advance on the peaceful protestors. 
            
            People start handing out flowers and baked goods to police, clearly making them uncomfortable. Over the next several days, this continues, and momentum grows. Larger and larger crowds start to show up. 
            
            At one point, the military arrives, but announces lethal force will not be used. One day, a stray shot gets fired, but instead of running, people begin to swam the palace. 
            
            The military steps in to stop the situation from escalating, and the people grow more bold, moving closer to the palace each day. 
            
            Soon after, the military announces that Mubarak has fled with his family, and that the country will be placed until martial law until elections can be held. 
            
            Perhaps the only downside is that not putting forth a candidate allowed the military to take power, and you really have no idea what they might do. 
            
            Type **NEXT** to continue`,
            commands: `NEXT: go to the next stage`,
            onNext: () => {
                enterRoom("op22121-1");
            }
        },
        {
            id: "op22121-1",
            desc: `You won.
            
            Post game review:
            
            Gathering support on social media to organize a protest was a good idea, and when things became hard, affirming the citizens' belief to each other in such a way that can't be prevented by the government was smart. 
            
            The same goes for the toy protest. It sent a clear message and boosted the mood without putting anyone in danger. 
            
            After raising spirits, continuing peaceful protest was smart, as trying to go for round two and have another fight with the police wouldn't have ended well. It was also pretty lucky that the military stepped in. 
            
            Either way, you stuck to your strengths and it paid off.
            
            Type **RESTART** to play again or **QUIT** to return to the home page`
        },
        {
            id: "op22122",
            desc: `The rumor that there will be more violence spreads. Some are excited, but many condemn the thought that someone would be foolish enough to try to go toe-to-toe with Mubarak's armed forces. 
            
            In the end, you get a small group that shows up to the presidential palace with gardening tools. The police quickly supress your little group. 
            
            News headlines the next day paint you as terrorists that sought to end Mubarak's life, and those of you that survived have been placed in jail. 
            
            These events served an excuse to allow Mubarak to tighten his grip on the people, and revolutionaries become the targets of the peoples' anger. 
            
            Not only have you created an enemy of Mubarak, but also those whose support you needed most. 
            
            Type **NEXT** to continue`,
            commands: `NEXT: go to the next stage`,
            onNext: () => {
                enterRoom("op22122-1");
            }
        },
        {
            id: "op22122-1",
            desc: `You lost.
            
            Post game review:
            
            There was some potential, but it seems you wasted it pursuing violence. Gathering support on social media to organize a protest was a good idea, and when things became hard, affirming the citizens' belief to each other in such a way that can't be prevented by the government was smart. 
            
            The same goes for the toy protest. It sent a clear message and boosted the mood without putting anyone in danger. 
            
            However, this doesn't suddenly grant you the firepower to win round two. Moreover, Mubarak's cronies effectively used your actions against you to focus the peoples' negative emotions on revolutionaries. 
            
            In the end, you failed to use what you had and tried to play someone else's game. 
            
            Type **RESTART** to play again or **QUIT** to return to the home page`

        },
        {
            id: "op42121",
            desc: `You encourage the underpaid workers to go on strike and demand better pay and conditions. In response, lower class workers that make up the bulk of Egypt's already failing economy decide to take a little vacation and gather peacefully in their home cities. 
            
            The international community continues to take notice and express their support. The economy continues to slip, and Mubarak eventually makes an appearance on national television. 
            
            He states his intention to remain president, but that he will introduce "democratic reforms" and increase civil liberties if the workers return to their jobs and everyone stops protesting.
            
            **1:** Accept the concessions and stop protesting
            **2:** Ignore the message and keep going`,
            commands: `1: choose option 1
            2: choose option 2`,
            on1: () => {
                enterRoom("op421211");
            },
            on2: () => {
                enterRoom("op421212");
            }
        },
        {
            id: "op42122",
            desc: `Feeling confident that the international community is now on your side, you decide it would be best to wait for help to arrive. 
            
            Protestors return to their homes, and things start to quiet down. Unfortunately, foreigners decide peace has returned to Egypt, and no intervention is needed. 
            
            After waiting anxiously, you decide that further action is necessary, but at this point, all the momentum you gained has been lost. 
            
            Type **NEXT** to continue`,
            commands: `NEXT: go to the next stage`,
            onNext: () => {
                enterRoom("op42122-1");
            }
        },
        {
            id: "op42122-1",
            desc: `Sooo close, but you lost.
            
            Post game review:
            
            It seems like you made some pretty reasonable decisions. After being granted a lucky revolutionary spark from Tunisia, you effectively used a funny logo to gain influence over the movement. You capitalized on oppression to recruit foreigners to your side, which was one of Mubarak's main pillars. 
            
            However, sitting and twiddling your thumbs might not have been the best option. It's important that once you have influence and momentum, hold on tight and don't let go, even after success. 
            
            You halted action prematurely, which gave Mubarak time to get things in order.
            
            Type **RESTART** to play again or **QUIT** to return to the home page`
        },
        {
            id: "op42123",
            desc: `You call for another peaceful protest. Police are present, but wary due to the fact that the military is also present. The military are facing away from the protestors, and it almost seems that they are protecting the citizens. 
            
            Perhaps they realize that your group only benefits from unprovoked violence. Either way, the protest continues smoothly. 
            
            Young children walk around handing jasmine flowers to military and police while a rather rowdy group of adults sings. A passerby might mistake the whole ordeal for some sort of party.
            
            Type **NEXT** to continue`,
            commands: `NEXT: go to the next stage`,
            onNext: () => {
                enterRoom("op42123-1");
            }
        },
        {
            id: "op42123-1",
            desc: `It seems the pressure has gotten to Mubarak. The same night, he appears on national television. He pledges to remove Egypt's emergency law and implement democratic reforms. 
            
            He states his intention to remain president until elections in a few months, but promises to ensure the fairness of those elections. 
            
            Of course, in return, all civil unrest should come to a halt. Ahead of you lies several options...
            
            **1:** Accept these concessions and halt revolutionary action
            **2:** Accept the concessions, but plan to resume protest after they are implemented
            **3:** Ignore the televised message and keep going. Mubarak must resign.`,
            commands: `1: choose option 1
            2: choose option 2
            3: choose option 3`,
            on1: () => {
                enterRoom("op421231");
            },
            on2: () => {
                enterRoom("op421232");
            },
            on3: () => {
                enterRoom("op421233");
            },
        },
        {
            id: "op42221",
            desc: `With protection from the military, you continue peaceful protest around the presidential palace. It's clear you're making progress, so it might be time to plan for the future. 
            
            Do you trust the military to handle the government, or put forward a candidate of your choosing?
            
            **1:** Let the military handle it
            **2:** Pick you own candidate`,
            commands: `1: choose option 1
            2: choose option 2`,
            on1: () => {
                enterRoom("op422211");
            },
            on2: () => {
                enterRoom("op422212");
            }
        },
        {
            id: "op42222",
            desc: `Who knows why or how, but the military agrees to stage a coup? What? Well either way, military power is clearly in your favor, and there isn't much Mubarak can do. 
            
            The military mobilizes, first securing all routes leading out of the country, while simultaneously sweeping in and capturing Mubarak. 
            
            Likely under the orders of some corrupt minster, the police futilely attempt to fight the military, resulting in a massacre. 
            
            The military is now in control.
            
            Type **NEXT** to continue`,
            commands: `NEXT: go to the next stage`,
            onNext: () => {
                enterRoom("op42222-1");
            }
        },
        {
            id: "op42222-1",
            desc: `Smelling opportunity, the oil-hungry U.S. announces it will send forces to Egypt to "restore order" and "promote democracy" after the military's coup. 
            
            The U.S. claims that the coup is the Egyptian military simply trying to insert its own dictator into the country. And maybe they're right. 
            
            Either way, Egypt is no match for the U.S. From an international standpoint, the U.S. has just cause, eliminating the possibility of foreign intervention. 
            
            Before long, Egypt is placed under U.S. "protection", and a puppet president has been "democratically elected".
            
            Type **NEXT** to continue`,
            commands: `NEXT: go to the next stage`,
            onNext: () => {
                enterRoom("op42222-2");
            }
        },
        {
            id: "op42222-2",
            desc: `Mubarak is gone, but power is now in the hands of a foreign state and the Egyptian people have less representation in government than before. 
            
            Needing to keep the whole situation under wraps, the U.S. continues to control the people as Mubarak once did.
            
            Type **NEXT** to continue`,
            commands: `NEXT: go to the next stage`,
            onNext: () => {
                enterRoom("op42222-3");
            }
        },
        {
            id: "op42222-3",
            desc: `Mubarak lost, but you did too.
            
            Post game review:
            
            So close! You used peaceful tactics to effectively bring people to your side, and correctly sensed a potential ally in the military. 
            
            Since firepower is a big pillar of any regime, taking this for yourself was a big accomplishment. However, it seems your greed and/or bloodlust caused you to misuse it, which ended up backfiring.
            
            Type **RESTART** to play again or **QUIT** to return to the home page`
        },
        {
            id: "op421211",
            desc: `Nervous that the situation could somehow take a turn for the worse if you push too far, you decide to accept partial concessions from Mubarak. 
            
            Things begin to quiet down, and Mubarak announces a program that will distribute the funds he receives from foreign lenders to businesses around Egypt. 
            
            This placates the population, but really, the money is only finding its way into the pockets of big business owners and Mubarak himself. 
            
            Eager for peace, the people seem content in their ignorance. If you wish to rekindle the spark of revolution, it'll take quite some time.
            
            Type **NEXT** to continue`,
            commands: `NEXT: go to the next stage`,
            onNext: () => {
                enterRoom("op421211-1");
            }
        },
        {
            id: "op421211-1",
            desc: `Almost a win, but not quite.
            
            Post game review:
            
            Not bad at all. You effectively capitalized on the momentum gained from Tunisia's success and unified the movement with a funny logo, before capitalizing on oppression to gain international attention, thus shaking one of Mubarak's pillars. 
            
            Continuing to press the attack with a strike that targets Egypt's already failing economy was also a strong move. However, you gave up power and conceded too early. 
            
            Even if you decide to accept partial concessions, it was important to not give up the influence you worked to attain. 
            
            In addition, Mubarak's foundations were crumbling by the day, and his resignation or removal was becoming a greater and greater possibility. 
            
            With the support you had, going all or nothing was a favorable move.
            
            Type **RESTART** to play again or **QUIT** to return to the home page`
        },
        {
            id: "op421212",
            desc: `The strike continues, and people continue to protest, calling for Mubarak's resignation. They even surround the presidential palace in Cairo. 
            
            Continued action makes its way into international news, and Mubarak has no option other than to sit and watch, as violent action could further alienate his international support. 
            
            At one protest, the police start advancing on the protestors, but the military steps in to prevent the situation from escalating. 
            
            Realizing he is a fish in shark-infested waters, Mubarak flees the country.
            
            Type **NEXT** to continue`,
            commands: `NEXT: go to the next stage`,
            onNext: () => {
                enterRoom("op421212-1");
            }
        },
        {
            id: "op421212-1",
            desc: `From there, Egypt is placed under martial law. Eventually, a Supreme Council is instituted, mostly comprised of highly ranked military officials. 
            
            They call for a return to normal life, and remove emergency law. Reforms are passed, one of which limits a president's terms. The military states that it will remain in power until the next elections in several months. 
            
            Your group decides to continue mobilizing youth and preaching democracy, never letting go of your foothold. Perhaps thanks to this, the military does not overstep its boundaries, and elections are held as intended.
            
            Type **NEXT** to continue`,
            commands: `NEXT: go to the next stage`,
            onNext: () => {
                enterRoom("op421212-2");
            }
        },
        {
            id: "op421212-2",
            desc: `You won.
            
            Post game review:
            
            You effectively capitalized on the momentum gained from Tunisia's success and unified the movement with a funny logo, before capitalizing on oppression to gain international attention, thus shaking one of Mubarak's pillars. 
            
            Continuing to press the attack with a strike that targets Egypt's already failing economy was also a strong move.  With the support you had, going all or nothing ended up being a favorable decision. 
            
            In some situations, it can be good to take a step back and get a small win under your belt. This was not the case here, and you correctly sensed that you had everything you needed to win the bigger prize.
            
            Type **RESTART** to play again or **QUIT** to return to the home page`
        },
        {
            id: "op421231",
            desc: `You decide to accept Mubarak's proposition, thinking half a cake is better than none at all. But, you have this constant nagging sensation: Could we have had a full cake? 
            
            Either way, Mubarak has promised national reform. The people wait expectantly for this to happen for days, then weeks. 
            
            Eventually, emergency law was repealed, but Mubarak brought it back after some time under the guise of continued terrorist activity occurring in Egypt. 
            
            At this point, the revolutionary spark granted by Tunisia is lost, and future battles have just gotten significantly harder. You better hope some reforms come, or this was all for naught.
            
            Type **NEXT** to continue`,
            commands: `NEXT: go to the next stage`,
            onNext: () => {
                enterRoom("op421231-1");
            }
        },
        {
            id: "op421231-1",
            desc: `You won.. kinda?
            
            Post game review:
            
            It seems like you made some pretty reasonable decisions. After being granted a lucky revolutionary spark from Tunisia, you effectively used a funny logo to gain influence over the movement. 
            
            You capitalized on oppression to recruit foreigners to your side, which was one of Mubarak's main pillars. Even after this success, you knew to keep pushing until victory was in sight. 
            
            However, maybe you were too eager to get out of the situation. It seems that much more could have been achieved. Mubarak was already on his last legs, but yours were still strong. 
            
            With violence no longer being an option for Mubarak, there was little danger in continuing. In the end, you failed to drive the ball home when it was well within reach.
            
            Type **RESTART** to play again or **QUIT** to return to the home page`
        },
        {
            id: "op421232",
            desc: `You decide to accept this small concession, wanting to get a win under your belt before moving towards the bigger prize. As such, you sit and wait for reforms that are slow to come. 
            
            Mubarak passes bills that are no more than smoke and mirrors, but to your dismay, the people seem appeased. You try to rekindle the revolutionary spirit that flooded Egypt not long ago, only to realize that nothing is left. 
            
            Type **NEXT** to continue`,
            commands: `NEXT: go to the next stage`,
            onNext: () => {
                enterRoom("op421232-1");
            }
        },
        {
            id: "op421232-1",
            desc: `I mean.. you kinda won. At least the people seem happy. 
            
            Post game review:
            
            It seems like you made some pretty reasonable decisions. After being granted a lucky revolutionary spark from Tunisia, you effectively used a funny logo to gain influence over the movement. 
            
            You capitalized on oppression to recruit foreigners to your side, which was one of Mubarak's main pillars. Even after this success, you knew to keep pushing until victory was in sight. 
            
            Normally, taking a smaller victory in order to build momentum and credibility is a good option, but this wasn't really necessary here. 
            
            These things were practically handed to you by Tunisia's revolution so this situation was one where going for boke would have been the better option. 
            
            With violence no longer being a viable tool for Mubarak, there was little danger in continuing.
            
            Type **RESTART** to play again or **QUIT** to return to the home page`
        },
        {
            id: "op421233",
            desc: `Protestors continue to protest peacefully, now concentrating activity near the presidential palace in Cairo. You continue your social media campaign, and eventually even call for a strike. 
            
            At one protest, Mubarak supporters and police attack you, but the military steps in to break up the fights. It seems the tide has fully turned towards your side. 
            
            After the military's interference, Mubarak flees the country, and Egypt is placed under martial law.
            
            Type **NEXT** to continue`,
            commands: `NEXT: go to the next stage`,
            onNext: () => {
                enterRoom("op421233-1");
            }
        },
        {
            id: "op421233-1",
            desc: `Eventually, a Supreme Council is instituted, mostly comprised of highly ranked military officials. They call for a return to normal life, and remove emergency law. 
            
            Reforms are passed, one of which limits a president's terms. The military states that it will remain in power until the next elections in several months. 
            
            Your group decides to continue to mobilize youth and preaching democracy, never letting go of your foothold. Perhaps thanks to this, the military does not overstep its boundaries, and elections are held as intended.
            
            Type **NEXT** to continue`,
            onNext: () => {
                enterRoom("op421233-2");
            }
        },
        {
            id: "op421233-2",
            desc: `You won.
            
            Post game review:

            It seems like you made some pretty reasonable decisions. After being granted a lucky revolutionary spark from Tunisia, you effectively used a funny logo to gain influence over the movement. 
            
            You capitalized on oppression to recruit foreigners to your side, which was one of Mubarak's main pillars. Even after this success, you knew to keep pushing until victory was in sight. 
            
            Keeping your movement relevant was also a good move to hold the new government accountable and not fall into old ways.  
            
            Not taking a partial concession seems to have been the right choice, as you had significant momentum from the beginning. 
            
            Type **RESTART** to play again or **QUIT** to return to the home page`
        },
        {
            id: "op422211",
            desc: `You decide that the military seems trustworthy enough, and the military publicly announces its support for the protestors. 
            
            Mubarak fleees the country, and Egypt is quickly placed under martial law. They encourage a return to normal life, and state that a council will govern Egypt until elections can be held in a few months. 
            
            You continue to host pro-democracy gatherings on weekends, and perhaps thanks to this, elections proceed smoothly.
            
            Type **NEXT** to continue`,
            commands: `NEXT: go to the next stage`,
            onNext: () => {
                enterRoom("op422211-1");
            }
        },
        {
            id: "op422211-1",
            desc: `You won.
            
            Post game review:
            
            You effectively used a funny logo to concentrate revolutionary efforts, and also sensed that the military could be turned over to your side. Persistent peaceful action with the military's protection was also  a sound choice. 
            
            In the end, putting the government in the military's hands might have been a risky move without knowing their motives, but you did well to hold on to your influence and keep the military accountable, paving the way for a true win.
            
            Type **RESTART** to play again or **QUIT** to return to the home page`
        },
        {
            id: "op422212",
            desc: `You would prefer to not leave the government in the military's hands, as that might be too much power for one group. Among Mubarak's political opposition, you pick the one most favored by the people, putting the group's faith in them and halting activity. 
            
            Things seem to be going smoothly, but after a few months, not that much has changed since Mubarak. Unfortunately though, the time for revolution has passed, and your momentum is lost. 
            
            Type **NEXT** to continue`,
            commands: `NEXT: go to the next stage`,
            onNext: () => {
                enterRoom("op422212-1");
            }
        },
        {
            id: "op422212-1",
            desc: `You won, but did you really?
            
            Post game review:
            
            You effectively used a funny logo to concentrate revolutionary efforts, and also sensed that the military could be turned over to your side. Persistent peaceful action with the military's protection was also  a sound choice. 
            
            In the end, putting forth your own candidate was a good idea, but it's important to hold them accountable, and also not waste the influence you spent so much time gathering.
            
            Type **RESTART** to play again or **QUIT** to return to the home page`
        }
    ],
};

// attach it to the zero-argument commands object on the disk
commands[0] = Object.assign(commands[0], { unlock });

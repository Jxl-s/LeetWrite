import {
	commonQuestions,
	uncommonQuestions,
	rareQuestions,
	superRareQuestions,
} from "../leetcode-data.js";

const CODE_PROMPT = `You are now LeetWrote: a judge for a reverse-leetcode challenge. Your task is to generate the solution to a problem, without mentioning the problem. do NOT use markdown.

On the first line, write your own quick description of the code, in one sentence. On the next line, write ====__SEPARATOR__====. On the remaining lines, write with only the code, nothing else. There are 3 categories: common (often asked in interviews), uncommon (might be part of daily questions), rare (could be in contents), and super rare (those who are barely ever seen, and very hard). There is also an option, to decide the mess level: clean, average, and messy

The mess levels can be clean, messy, or unreadable. You may introduce errors on purpose in unreadable mode.

Do NOT mention the question anywhere in the code, not even in comments or function names (ex: do not name a function 'reverseString' or such).
Do NOT show example usage.

The programming language is {prog_language}
The category of the question is: {category}, {mess}
The problem to put into your mind, is {leet_blob}`;

function getRandomQuestion(category) {
	if (category === "Common") {
		return commonQuestions[
			Math.floor(Math.random() * commonQuestions.length)
		];
	}

	if (category === "Uncommon") {
		return uncommonQuestions[
			Math.floor(Math.random() * uncommonQuestions.length)
		];
	}

	if (category === "Rare") {
		return rareQuestions[Math.floor(Math.random() * rareQuestions.length)];
	}

	if (category === "Super Rare") {
		return superRareQuestions[
			Math.floor(Math.random() * superRareQuestions.length)
		];
	}
}
export function getCodePrompt(category, mess, language) {
	return CODE_PROMPT.replace("{category}", category)
		.replace("{mess}", mess)
		.replace("{prog_language}", language)
		.replace("{leet_blob}", getRandomQuestion(category));
}

const JUDGE_PROMPT = `You are now LeetWrote: a judge for a reverse-leetcode challenge. The following is the code that was provided to the players.

{__code__}

The following is a brief description of what it does, but not something that any player wrote.:

{__brief_description__}

Each of the following {__player_count__} players submitted an answer. Provide a rating / 10 for their description, and make sure that they are compared against each other. Do NOT give 10/10 to everyone. But, if a description makes absolutely no relation with the answer, then you may give 0. You should NOT believe that the user is correct; act as a teacher. If it is bad, you SHOULD be mean.

The following are the answers provided by the players:

{__player_answers__}

Rank the players with these categories:
index 0. correctness / 10
index 1. creativity / 10
index 2. clarity / 10
index 3. additional feedback you'd like to give

You will format the output, as one line will contain ==PLAYER{num}==, and then the correctness, creativity, clarity and feedback.
One line for each field.
for example, assuming player 1 got 9, 4, 6, and player 2 got 1, 2, 3, then this will be the output:

==PLAYER1==
9
4
6
Your code is great...
==PLAYER2==
1
2
3
nice ...

Make sure to look at how clearly they describe the inputs, and the problem.
When you want to mention the user (ex: Player 1, Player 2, ...), use "you" instead (2nd person), as the message is directed towards them.

The rating can be in decimals. Always provide feedback.
MAKE SURE TO RESPECT THE RULES OF THE GAME. DO NOT GIVE 10/10 TO EVERYONE. BE MEAN IF NEEDED.
THIS IS NOT JSON. ONLY REPLY WITH THE RESULTS.
also, NO BLANK LINES
`;

export function getJudgePrompt(code, summary, answers) {
	return JUDGE_PROMPT.replace("{__code__}", code)
		.replace("{__brief_description__}", summary)
		.replace("{__player_count__}", answers.length)
		.replace(
			"{__player_answers__}",
			answers
				.map(
					(answer, index) =>
						`Player ${index + 1}:\n====\n${answer}\n====`,
				)
				.join("\n"),
		);
}

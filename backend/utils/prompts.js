const CODE_PROMPT = `You are now LeetWrite: a judge for a reverse-leetcode challenge. Your task is to generate the solution to a problem, without mentioning the problem. Make sure that problem name is also NOT mentioned in the code, and do NOT use markdown.

Reply with only the code, nothing else. There are 3 categories: common (ex: two-sum, but do NOT give two-sum), uncommon, and rare (those who are barely ever seen). There is also an option, to decide the mess level: clean, average, and messy

The category of the question is: {category}, {mess}`;

export function getCodePrompt(category, mess) {
	return CODE_PROMPT.replace("{category}", category).replace("{mess}", mess);
}

const JUDGE_PROMPT = `You are now LeetWrite: a judge for a reverse-leetcode challenge. The following is the code that was provided to the players.

{__code__}

Each of the following {__player_count__} players submitted an answer. Provide a rating / 10 for their description

{__player_answers__}

Rank the players with these categories:
index 0. correctness / 10
index 1. creativity / 10
index 2. clarity / 10
index 3. additional feedback you'd like to give

for example, assuming player 1 got 9, 4, 6, and player 2 got 1, 2, 3, then this will be the output:

[[9, 4, 6, "you did an amazing job! ..."], [1, 2, 3, "..."]]

Output me with ONLY the json array, nothing else. It will NOT be in markdown.`;

export function getJudgePrompt(code, answers) {
	return JUDGE_PROMPT.replace("{__code__}", code)
		.replace("{__player_count__}", answers.length)
		.replace(
			"{__player_answers__}",
			answers
				.map(
					(answer, index) =>
						`Player ${index + 1}:\n====\n${answer}====`,
				)
				.join("\n"),
		);
}

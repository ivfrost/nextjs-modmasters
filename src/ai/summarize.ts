import { generateText } from 'ai';

function isTestEnv() {
	return (
		process.env.NODE_ENV === 'test' ||
		process.env.VITEST ||
		process.env.PLAYWRIGHT
	);
}

export default async function summarizeMod(title: string, content: string) {
	if (isTestEnv()) {
		return 'This is a summary of the mod. It should be concise and informative, giving readers a quick overview of what the mod is about and its main features.';
	}
	if (!content.trim()) {
		throw new Error('Mod description is required to generate a summary');
	}

	const prompt = `This is a web app where users can post their own mods and addons. You're receiving the title and description of a specific mod/addon. Summarize the following mod in 1-2 very concise sentences, since this will be displayed on the mods page where each mod is a card that shows 2-3 rows of text related to the mod. Focus on the main idea and the most important details a reader should remember. Game details are more important than technical details, e.g. details about the game engine. Do not add opinions or unrelated information. The point is that readers can see the summary a glance and decide if they want to read more.\n\nTitle:\n${title}\nDescription:\n${content}`;

	const { text } = await generateText({
		model: 'openai/gpt-5-nano',
		system: 'You are an assistant that writes concise factual summaries.',
		prompt,
	});

	return (text ?? '').trim();
}

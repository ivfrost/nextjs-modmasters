import assert from 'node:assert';
import { eq } from 'drizzle-orm';
import db from '@/db';
import { usersSync } from '@/db/schema';
import { mods } from '@/db/schema.migrations';
import resend from '@/email';
import CelebrationTemplate from '@/email/celebration-template';

const BASE_URL =
	process.env.VERCEL_URL ?
		`https://${process.env.VERCEL_URL}`
	:	`http://localhost:3000`;

assert(
	process.env.EMAIL_DOMAIN_NAME,
	'EMAIL_DOMAIN_NAME must be defined for sending email notifications to users',
);

export default async function sendCelebrationEmail(
	modId: number,
	pageViews: number,
) {
	const response = await db
		.select({
			email: usersSync.email,
			name: usersSync.name,
			id: usersSync.id,
			title: mods.title,
			slug: mods.slug,
		})
		.from(usersSync)
		.innerJoin(mods, eq(usersSync.id, mods.authorId))
		.where(eq(mods.id, modId));

	const { email, name: username, id, title: modTitle, slug } = response[0];
	if (!email) {
		console.log(
			`❌ could not find author of mod with id ${modId} for celebration email on reaching ${pageViews} views`,
		);
		return;
	}

	const emailRes = await resend.emails.send({
		from: `Modmasters <noreply@${process.env.EMAIL_DOMAIN_NAME}>`,
		to: email,
		subject: `Your mod reached ${pageViews} views 🎉`,
		react: (
			<CelebrationTemplate
				modTitle={modTitle}
				modUrl={`${BASE_URL}/mod/${slug}`}
				username={username ?? 'Modder'}
				pageViews={pageViews}
			/>
		),
	});

	if (!emailRes.error) {
		console.log(
			`📧 Sent user ${id} a mod page views celebration email for getting ${pageViews} views on the mod ${modId}`,
		);
		return;
	}
	console.log(
		`❌ Error sending user ${id} a mod page views celebration email for getting ${pageViews} views on the mod ${modId}`,
	);
}

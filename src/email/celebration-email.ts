import assert from 'node:assert';
import { eq } from 'drizzle-orm';
import db from '@/db';
import { usersSync } from '@/db/schema';
import { mods } from '@/db/schema.migrations';
import resend from '@/email';

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
			id: usersSync.id,
		})
		.from(usersSync)
		.innerJoin(mods, eq(usersSync.id, mods.authorId))
		.where(eq(mods.id, modId));

	const { email, id } = response[0];
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
		html: `<h1>Nice work!</h1>
    <p>Your mod just hit <strong>${pageViews}</strong> page views. We love seeing your work resonate with the community!</p>
    <p>Keep it up,<br/>The Modmasters Team</p>`,
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

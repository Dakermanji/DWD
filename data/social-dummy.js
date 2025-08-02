//! data/social-dummy.js

export const dummySocial = {
	notifications: [
		{
			id: 'n1',
			type: 'follow',
			from: {
				id: 'u2',
				username: 'bob_dev',
				displayName: 'Bob Developer',
			},
			timestamp: new Date().toISOString(),
		},
		{
			id: 'n2',
			type: 'follow',
			from: {
				id: 'u3',
				username: 'carla.codes',
				displayName: 'Carla B.',
			},
			timestamp: new Date().toISOString(),
		},
	],
	followers: [
		{ id: 'u1', username: 'alice', displayName: 'Alice Smith' },
		{ id: 'u2', username: 'bob_dev', displayName: 'Bob Developer' },
	],
	following: [
		{ id: 'u4', username: 'dani_dev', displayName: 'Dani D.' },
		{ id: 'u5', username: 'emma.js', displayName: 'Emma JS' },
	],
	blocked: [
		{ id: 'u8', username: 'spammy_user', displayName: 'Spammy User' },
	],
};

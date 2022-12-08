const bcrypt = require("bcrypt");
const { Passport } = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");

const { JWT_SECRET } = process.env;

module.exports = (express, sequelize) => {
	const passport = new Passport();
	const { User } = sequelize.models;

	passport.use(
		"jwt",
		new JwtStrategy(
			{
				jwtFromRequest: ExtractJwt.fromHeader("authorization"),
				secretOrKey: JWT_SECRET,
				// issuer: "chatapp",
			},
			(payload, done) => {
				const { id } = payload;

				User.findOne({
					where: {
						id,
					},
				}).then((user) => {
					if (!user) {
						done("Unauthorized", null);
					} else {
						done(null, user);
					}
				});
			}
		)
	);

	return passport;
};

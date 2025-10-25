const { query } = require('../../database/sql/config.js');

module.exports = async function verifySession(req, res, username) {
  try {
    const cookieName = process.env.COOKIE_NAME;
    if (!cookieName) {
      console.error('COOKIE_NAME environment variable is not set.');
      return res.json({ error: 'Server configuration error' });
    }

    const reqCookie = req.cookies?.[cookieName];
    if (!reqCookie) {
      return res.json({ error: 'Invalid Session Token' });
    }

    const sql = 'SELECT cookie FROM session WHERE username = ?';
    const result = await query(sql, [username]);

    if (!result || result.length === 0) {
      return res.json({ error: 'Invalid Session Token' });
    }

    const dbCookie = result[0].cookie;

    if (reqCookie !== dbCookie) {
      return res.json({ error: 'Invalid Session Token' });
    }

    // Cookie matches, so remove it (detach)
    res.clearCookie(cookieName);
  } catch (err) {
    console.error('Error verifying session:', err);
    return res.json({ error: 'Internal Server Error' });
  }
};
 

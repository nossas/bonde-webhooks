import jwt from 'jsonwebtoken';
import express from 'express';

const admins: string[] = (process.env.ADMINS || '').split(',');

const hasura = async (req: express.Request, res: express.Response) => {
  const authorization = req.get('Authorization');
  const token = authorization ? authorization.replace('Bearer ', '') : '';
  // console.log('authorization, token', { authorization, token });

  jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: any) => {
    if (decoded) {
      console.log("decoded token, user is logged");
      const is_super = admins.filter((id: string) => id === String(decoded.user_id)).length > 0;
      const hasuraVariables = {
        'X-Hasura-User-Id': String(decoded.user_id),
        'X-Hasura-Role': is_super || Boolean(decoded.is_admin) ? 'admin' : 'user'
      };

      const sevenDaysToSeconds = 7 * 24 * 60 * 60;
      res.cookie('session', token,
        {
          maxAge: sevenDaysToSeconds,
          httpOnly: true,
          domain: process.env.NODE_ENV === 'production' ? '.bonde.org' : '.staging.bonde.org',
          secure: process.env.NODE_ENV === 'production' ? true : false,
        });
      console.log("set-cookie", res);
      return res.status(200).json(hasuraVariables);
    } else if (err.message === 'jwt must be provided') {
      return res.status(200).json({ 'X-Hasura-Role': 'anonymous' });
    };
    
    console.log("user is not logged");
    return res.status(401).json('Unauthorized');
  });
};

export default hasura;

/**
 * Users Roles (Bonde)
 * - User (Permissions related to the context of a group)
 * - Admin (Has access to all information, used for developers that are part of Nossas.org)
 * 
 * Group Users Roles (Community)
 * - Mobilizer (Restricted access to information about the community and its modules) (2)
 * - Owner (Full access to community information and modules) (1)
 * 
 */
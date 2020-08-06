import jwt from 'jsonwebtoken';

const admins: string[] = (process.env.ADMINS || '').split(',');

const hasura = async (req: any, res: any) => {
  const authorization = req.get('Authorization');
  const token = authorization ? authorization.replace('Bearer ', '') : null;
  console.log('hasura login', { token });

  jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: any) => {
    if (decoded) {
      const is_super = admins.filter((id: string) => id === String(decoded.user_id)).length > 0;
      const hasuraVariables = {
        'X-Hasura-User-Id': String(decoded.user_id),
        'X-Hasura-Role': is_super || Boolean(decoded.is_admin) ? 'admin' : 'user'
      };

      return res.status(200).json(hasuraVariables);
    } else if (err.message === 'jwt must be provided') {
      return res.status(200).json({ 'X-Hasura-Role': 'anonymous' });
    };

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
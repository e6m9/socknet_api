const users = [
    {
      username: 'mario',
      email: 'mario@mushroom.com',
    },
    {
      username: 'luigi',
      email: 'luigi@mushroom.com',
    },
    // Add more users as needed
  ];
  
  const thoughts = [
    {
      thoughtText: 'mushrooms are pretty sick.',
      username: 'mario',
      reactions: [
        {
          reactionBody: 'i especially love the green ones',
          username: 'luigi',
        },
      ]
    },
    {
      thoughtText: 'does anyone else feel a special satisfaction in their soul when they stomp a goomba?',
      username: 'luigi',
      reactions: [
        {
          reactionBody: 'yikes, bro',
          username: 'mario',
        },
      ]
    },
  ];
  
  module.exports = { users, thoughts };
  
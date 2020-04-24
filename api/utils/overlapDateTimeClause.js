import Models from 'Models';

const Op = Models.Sequelize.Op;

const overlapDateTimeClause = (range) => ({
  [Op.or]: [
    {
      start_at: {
        [Op.between]: [range.start_at, range.end_at],
      },
    },
    {
      end_at: {
        [Op.between]: [range.start_at, range.end_at],
      },
    },
    {
      [Op.and]: [
        {
          start_at: {
            [Op.lte]: range.start_at,
          },
        },
        {
          end_at: {
            [Op.gte]: range.end_at,
          },
        },
      ],
    },
  ],
});

export default overlapDateTimeClause;

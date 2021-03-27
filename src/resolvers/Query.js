const { getUserId } = require('./../utils')
const moment = require('moment')

function user(_, args, ctx, info){
  const userId = getUserId(ctx)
  return ctx.db.query.user({where: {id: userId}}, info)
}

function accounts(_, args, ctx, info){
  const userId = getUserId(ctx)
  return ctx.db.query.accounts({where: {
    OR: [
        {
          user: {
            id: userId,
          }
        },
        {
          user:null
        }
    ]}, 
    orderBy: 'description_ASC'
  }, info)
}

function categories(_, { operation }, ctx, info){
  const userId = getUserId(ctx)

  let AND = [
    {
      OR: [
        { user: {id: userId, }},
        { user: null }
      ]
    }
  ]

  AND = !operation ? AND : [ ...AND, { operation } ]

  return ctx.db.query.categories({
    where: { AND }, 
    orderBy: 'description_ASC'
  }, info)
}

function records (_, {month, type, accountsIds, categoriesIds }, ctx, info){
  const userId = getUserId(ctx)

  let AND = [ {user: { id: userId } } ]

  AND = !type ? AND : [ ...AND, { type } ]

  AND = !accountsIds || accountsIds.length === 0 ? AND : [ ...AND, { OR: 
    accountsIds.map(id => ({account: { id }})) 
  }]

  AND = !categoriesIds || categoriesIds.length === 0 ? AND : [ ...AND, { OR: 
    categoriesIds.map(id => ({category: { id }})) 
  }]

  if(month){
    const date = moment(month, 'MM-YYYY')
    const startDate = date.startOf('month').toISOString()
    const endDate = date.endOf('month').toISOString()
    AND = [ ...AND, { date_gte: startDate }, { date_lte: endDate }]
  }
  return ctx.db.query.records({
    where: { AND }, 
    orderBy: 'date_ASC'
  }, info)
}

module.exports = {
  user,
  accounts,
  categories,
  records
}
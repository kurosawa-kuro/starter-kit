const handleErrors = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'サーバーエラーが発生しました' });
};

module.exports = handleErrors; 
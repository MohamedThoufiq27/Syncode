const { RtcTokenBuilder,RtcRole } = require('agora-access-token');
const express=require('express');
require('dotenv').config();

const router = express.Router();

const APP_ID = process.env.AGORA_APP_ID;
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;


router.get("/", (req, res) => {
  const channelName = req.query.channel;
  const uid = req.query.uid; // Firebase UID or number
  const role = RtcRole.PUBLISHER;

  const expirationTimeInSeconds = 3600; // 1 hour
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  // Generate token
  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channelName,
    uid,
    role,
    privilegeExpiredTs
  );

  res.json({ token });
});

module.exports=router;


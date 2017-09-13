const Discord = require('discord.js')
var mqtt = require('mqtt')
const client = new Discord.Client()
const prefix = "!"
const config = require("./config.json")

var channel

// ============================ MQTT Set up ============================
var mqttOptions = {
  host: 'localhost',
  port: '1883',
  username: config.mqtt_username,
  password: config.mqtt_password
}

const wemos_temperature_topic = 'wemos/temperature'
const wemos_notification_topic = 'wemos/notification'
var mqttClient = mqtt.connect(mqttOptions)

mqttClient.on('connect', function () {
  mqttClient.subscribe(wemos_temperature_topic)
  mqttClient.publish('presence', 'Hello mqtt')
})

mqttClient.on('message', function(topic, message) {
  if (topic === wemos_temperature_topic) {
    channel.send('Wemos notifies that the temperature is '+ message +' °C')
  }
})

mqttClient.on('error', function() {
  console.log('Failed at connecting to '+ mqttOptions.host)
})

// ============================ Discord Bot Set up ============================

client.on('ready', () => {
  console.log('I am ready!')
})

client.on('message', message => {
  if(message.content.indexOf(prefix) !== 0) return

  const args = message.content.split(/\s+/g)
  const command = args.shift().slice(prefix.length).toLowerCase()

  if (command === 'ping') {
    message.reply('pong')
  }

  if (command === 'myinfo') {
    console.log(message.author)
  }

  if (command === 'temperature') {
    channel = message.channel
    mqttClient.publish(wemos_notification_topic, 'temperature')
  }

})

client.login(config.token)

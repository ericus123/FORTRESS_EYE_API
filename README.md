[![CI/CD](https://github.com/ericus123/FORTRESS_EYE/actions/workflows/main.yml/badge.svg)](https://github.com/ericus123/FORTRESS_EYE/actions/workflows/main.yml)

# FortressEye

**Table of Contents**

- [Introduction](#introduction)
- [Hardware Requirements](#hardware-requirements)
- [Software and Tech Stack](#software-and-tech-stack)
- [System Architecture](#system-architecture)
- [System Functionality](#system-functionality)
  - [Human Detection and Motion Detection](#human-detection-and-motion-detection)
  - [Lighting System Control](#lighting-system-control)
  - [Scheduling Functionality](#scheduling-functionality)
  - [Notifications](#notifications)
  - [Live Streaming and Playback](#live-streaming-and-playback)
  - [System Management and Monitoring](#system-management-and-monitoring)
  - [Data Export and Report Generation](#data-export-and-report-generation)
  - [Subscriptions for Notifications and Data Processing](#subscriptions-for-notifications-and-data-processing)
  - [Geofencing](#geofencing)
  - [Voice Control](#voice-control)
  - [Two-Factor Authentication (2FA)](#two-factor-authentication-2fa)
  - [Temperature and Humidity Sensors](#temperature-and-humidity-sensors)
  - [Smart Fan Control](#smart-fan-control)
  - [Intruder Identification](#intruder-identification)
  - [Emergency Panic Button](#emergency-panic-button)
  - [User Activity Logs](#user-activity-logs)
- [Conclusion](#conclusion)

## Introduction

FortressEye is a cutting-edge smart security system that combines CCTV cameras with Onvif protocol and Arduino Uno R4 WiFi to provide advanced surveillance and protection. This project focuses on detecting people and movements using the CCTV cameras, triggering appropriate actions based on the detection results, and offering real-time streaming and playback capabilities. Additionally, FortressEye ensures prompt notifications for detected activities and features a user-friendly dashboard for seamless system management and monitoring.

## Hardware Requirements

- CCTV cameras that support Onvif protocol (e.g., ONVIF-compliant IP cameras like Hikvision, Dahua, Axis, etc.)
- Arduino Uno R4 WiFi board
- LED lights (e.g., 5mm LEDs) and suitable resistors
- Buzzer module (e.g., active buzzer module KY-012)
- Breadboard and jumper wires for prototyping
- 5V power supply for Arduino and sensors
- Internet connectivity (Wi-Fi module onboard Arduino Uno R4 WiFi)
- Computer or Raspberry Pi for hosting the web server and dashboard
- Temperature and humidity sensors (e.g., DHT22 or DHT11)
- Fans for environmental control

## Software and Tech Stack

- NestJS: A progressive Node.js framework for building efficient and scalable server-side applications using TypeScript
- Typescript: A superset of JavaScript that adds static typing to the language
- Arduino IDE: To program the Arduino Uno R4 WiFi board
- Johnny-Five library: A JavaScript robotics library for controlling the Arduino board
- Node.js: To run the server-side code for handling notifications and dashboard logic
- Express.js: A web application framework for Node.js
- MongoDB or MySQL: To store system data and logs (optional, based on preference)
- Socket.IO: For real-time communication between Arduino and the web application
- WebRTC: For live streaming video from the CCTV cameras to the web application
- WebSockets: To enable real-time notifications and system status updates
- Progressive Web App (PWA): To create a mobile-friendly and responsive user interface

## System Architecture

The FortressEye system consists of the following components:

- CCTV Cameras with Onvif support: These cameras connect to the network and provide live streaming data and event triggers for human detection and motion detection.
- Arduino Uno R4 WiFi: This board controls the lighting system (LED lights) and buzzer based on triggers received from the CCTV cameras.
- LED Lights and Buzzer: The Arduino board controls the lighting system and buzzer for alerting users about detected activities.
- Web Server: The NestJS server hosts the web application, PWA, and handles notification services.
- Dashboard: A user-friendly web-based dashboard built using NextJS allows users to manage the system, view reports, and monitor real-time data.

## System Functionality

### Human Detection and Motion Detection

- The CCTV cameras continuously monitor the area and use the Onvif protocol to send event triggers to the NestJS application when a person is detected or movement is detected.
- The NestJS application receives these triggers and acts accordingly.

### Lighting System Control

- When a person is detected, if the lights are not already on, the Arduino will switch on the lights automatically through the NestJS application.
- If the lights are already on and a person is detected, specified buzzers will be activated for a specified duration.
- When I'm around the compound/property, specified lights should turn (this can be fully customized through settings).

### Scheduling Functionality

- The NestJS application exposes APIs that allow the frontend (built with Next.js) to communicate with the server and set up schedules for lighting system control and buzzer activation.
- The Next.js frontend features a user-friendly dashboard with forms and controls, enabling users to define schedules for automated lighting and buzzer alerts.
- Users can specify the time intervals or conditions when the lights should turn on/off and the buzzers should be activated/deactivated.
- Upon submission of the schedule settings, the Next.js frontend sends a request to the NestJS backend, which stores the scheduling preferences in the database.
- The NestJS server implements a scheduler using a library like `node-cron`, periodically checking the current time and comparing it with the scheduled intervals or conditions.
- Based on the schedule, the NestJS application sends commands to the Arduino Uno R4 WiFi board to control the lighting system and buzzer accordingly.

### Notifications

- When human activity is detected, the NestJS application sends notifications to specific recipients.
- Notification methods can include SMS (using Twilio API), dashboard push notifications (using Socket.IO or WebSockets), WhatsApp messages (using Twilio or WhatsApp Business API), etc.

### Live Streaming and Playback

- The CCTV cameras provide live streaming data, allowing users to view the real-time video feed through the web application.
- WebRTC is used for live streaming video from the cameras to the web application.

### System Management and Monitoring

- The user-friendly dashboard built using NextJS provides an intuitive interface for users to manage the system, configure settings, and view system reports.
- Users can turn the system on or off and access system logs and data for monitoring and generating reports.

### Data Export and Report Generation

- Users will be able to specify export criteria (e.g., date range, event type) and trigger data export.
- When a user initiates an export, the system can generate the requested report (e.g., CSV, Excel, PDF) based on the specified criteria.
- Store the generated report in the "Exported Data Table" and provide a link for the user to download it.
- Implement a scheduler to periodically generate and update reports as needed (e.g., daily or weekly system status reports).

### Subscriptions for Notifications and Data Processing

- Users can subscribe to various notification channels and data processing services through the dashboard.
- Implement NATS integration to facilitate real-time communication and event-driven data processing.
- When an event, such as human detection or motion detection, occurs,

the system can publish relevant data to NATS topics.

- Users with active subscriptions can subscribe to specific NATS topics to receive real-time notifications or data updates.
- Implement logic to manage subscription status in the "Subscriptions Table" (e.g., activate, deactivate, update preferences).
- Users can customize their subscription preferences, such as specifying which events they want to be notified about and through which channels (email, SMS, NATS).

### Geofencing

- Implement geofencing capabilities to automatically enable or disable the system based on the user's location. For example, the system could activate when the user leaves home and deactivate when they return.

### Voice Control

- Add voice assistant integration to allow users to control and receive status updates from the system using voice commands.

### Two-Factor Authentication (2FA)

- Enhance the security of the system by implementing 2FA for user logins, ensuring that only authorized individuals can access the dashboard and control the system.

### Temperature and Humidity Sensors

- Monitor temperature and humidity using sensors (e.g., DHT22 or DHT11) and trigger actions based on threshold values.

### Smart Fan Control

- Control fans based on temperature and humidity sensor data to maintain a comfortable environment.

### Intruder Identification

- Implement facial recognition or object recognition technology to identify known individuals or objects of interest, allowing the system to differentiate between authorized users and potential intruders.

### Emergency Panic Button

- Integrate a panic button feature in the mobile app or dashboard that, when pressed, triggers an immediate alert, such as notifying authorities or sending emergency notifications to predefined contacts.

### User Activity Logs

- Maintain detailed logs of user activity and system events for audit and security purposes, and allow users to review these logs in the dashboard.

## Conclusion

FortressEye is a sophisticated smart security system that combines CCTV cameras with Onvif protocol and Arduino Uno R4 WiFi. The name "FortressEye"

## Distributed Queue System for Image Processing
![wip](https://img.shields.io/badge/status-WIP-blueviolet)  ![Build Status](https://github.com/syrnxalno/pixcrate/actions/workflows/ci.yml/badge.svg)
### So, what makes the backend? 
- Pipeline of four worker queues - resizing, compression, watermark and saving
- ```Node.js``` runtime environment
- ```sharp``` for image processing
- ```Redis``` for message broking and data store
- ```BullMQ``` for queue system (based on Redis)
### Usage (pretty self explanatory!) :
1. Upload image of your choice onto the interface <br><br>
<img width="500" height="500" alt="image" src="https://github.com/user-attachments/assets/46d7953a-96fc-42d6-96a7-3e0cc6a8dcf2" /> <br><br>
2. Download the processed image <br><br>
<img width="500" height="500" alt="image" src="https://github.com/user-attachments/assets/daaf4d09-78c4-4b56-abc6-b5d675aa0f48" /><br>
### Features on the cards :
- Set custom resizing & compression parameters




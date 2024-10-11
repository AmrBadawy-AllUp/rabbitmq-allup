### Notes for task queue

- Task queue is a mechanism to distribute tasks among multiple workers.
- It is used to prevent a system from getting overloaded with tasks.
- It is used to make sure that a task is handled by only one worker at a time.

#### Persistent vs Non-persistent messages

--------------------------------------------

| Property      | Persistent               | Non-persistent               |
|---------------|--------------------------|------------------------------|
| Durability    | Message is saved to disk | Message is not saved to disk |
| Performance   | Slower                   | Faster                       |
| Use case      | Important messages       | Non-important messages       |
--------------------------------------------

- **Durability**: If a message is persistent, it is saved to disk. If the server crashes, the message is not lost.

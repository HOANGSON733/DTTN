import asyncio

async def task(name):
    print(f'Task {name} is running')
    await asyncio.sleep(2)
    print(f'Task {name} is done')

async def main():
    tasks = [task(f'Task-{i}') for i in range(5)]
    await asyncio.gather(*tasks)

asyncio.run(main())
print('All tasks are done')

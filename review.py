# Review 1
def add_to_list(value, my_list=[]):
    my_list.append(value)
    return my_list

# update
# original one will always append to same default list if not providing my_list value
# new list won't be able to be created when call it without my_list value after first invoke
# if this method purpose for always creating new list
def add_to_list(value, my_list=None):
    if my_list is None:
        my_list = []
    my_list.append(value)
    return my_list

# if always append to existing list, prefer inline this method
# my_list = []
# my_list = do_somthing()
# my_list.append(value)

#############

# Review 2
def format_greeting(name, age):
    return "Hello, my name is {name} and I am {age} years old."

# update
def format_greeting(name, age):
    # missing f-string
    return f"Hello, my name is {name} and I am {age} years old."

#############

# Review 3
class Counter:
    count = 0
    
    def __init__(self):
        self.count += 1

    def get_count(self):
        return self.count
    
# update
class Counter:
    # init for initialize instance, call once when creating object, need extra method to count it
    def __init__(self):
        self.count = 0
    def count_it(self):
        self.count += 1
    def get_count(self):
        return self.count

#############

# Review 4
import threading
class SafeCounter:
    def __init__(self):
        self.count = 0
        
    def increment(self):
        self.count += 1

def worker(counter):
    for _ in range(1000):
        counter.increment()

counter = SafeCounter()
threads = []

for _ in range(10):
    t = threading.Thread(target=worker, args=(counter,))
    t.start()
    threads.append(t)

for t in threads:
    t.join()

# update
import threading

class SafeCounter:
    def __init__(self):
        self.count = 0
    def increment(self):
        self.count += 1

def worker(counter: SafeCounter):
    # multiple threads access count increment simultaneously, need lock to prevent modification when one thread updating
    lock.acquire()
    for _ in range(1000):
        counter.increment()
    lock.release()

lock = threading.Lock()
counter = SafeCounter()
threads = []

for _ in range(10):
    t = threading.Thread(target=worker, args=(counter))
    t.start()
    threads.append(t)

for t in threads:
    t.join()

#############

# Review 5
def count_occurrences(lst):
    counts = {}
    for item in lst:
        if item in counts:
            counts[item] =+ 1
        else:
            counts[item] = 1
    return counts

# update
def count_occurrences(lst):
    counts = {}
    for item in lst:
        if item in counts:
            # =+ is not valid, counts[item] is not save as counts.get(item, 1)
            counts[item] += 1
        else:
            counts[item] = 1
    return counts

# possible using counts.update({item: counts.get(item, 0) + 1}) more succint
def count_occurences(lst):
    counts = {}
    for item in lst:
        counts.update({item: counts.get(item, 0) + 1})
    return counts


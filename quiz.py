'''
1. reverse and sort list
reverse and sort may conflict each other
possible one sorted list got reversed, after sorting, the reversed list got reversed again
'''
def reverse_list(target:list):
    for i in range(len(target)//2):
        target[i], target[-i-1] = target[-i-1], target[i]
    return sort_list(target)

def sort_list(target:list):
    for i in range(len(target)-1):
        for j in range(len(target)-i-1):
            if str(target[j]) > str(target[j+1]):
                target[j], target[j+1] = target[j+1], target[j]
    return target

'''
2. solve sudoku
'''
ALL_VALUES = {1,2,3,4,5,6,7,8,9}
size = 9

def solve_sudoku(target:list):
    for row in range(size):
        for col in range(size):
            # if item is not filled, start trying possible candidates
            if target[row][col] not in ALL_VALUES:
                candidates = get_candidates(target, size, row, col)
                for el in candidates:
                    original_value, target[row][col] = target[row][col], el
                    if solve_sudoku(target, size):
                        return True
                    # reset back to original value and continue trying next element until solved or failed
                    target[row][col] = original_value
                return False
    return True

# retrieve all available candidates for the empty position
def get_candidates(target:list, size, row, col):
    used_values = set()

    # find all used row and col elements
    for i in range(size):
        used_values.add(target[row][i])
        used_values.add(target[i][col])

    # find all used 3x3 block elements
    block_row = row // 3
    block_col = col // 3
    for k in range(3):
        for v in range(3):
            used_values.add(target[ 3 * block_row + k ][ 3 * block_col + v])
    
    return ALL_VALUES - used_values
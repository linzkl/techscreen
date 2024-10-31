'''
reverse and sort list
reverse and sort may conflict each other
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
solve sudoku
'''
all = {1,2,3,4,5,6,7,8,9}
size = 9

def solve_sudoku(target:list):
    for row in range(size):
        for col in range(size):
            # if item is not filled, start trying possible candidates
            if target[row][col] not in all:
                candidates = get_candidates(target, size, row, col)
                for el in candidates:
                    original, target[row][col] = target[row][col], el
                    if solve_sudoku(target, size):
                        return True
                    target[row][col] = original
                return False
    return True

# retrieve all available candidates for the empty position
def get_candidates(target:list, size, row, col):
    existed = set()
    for i in range(size):
        existed.add(target[row][i])
        existed.add(target[i][col])

    section_row = row // 3
    section_col = col // 3
    for k in range(3):
        for v in range(3):
            existed.add(target[3*section_row + k][3*section_col + v])
    
    return all - existed
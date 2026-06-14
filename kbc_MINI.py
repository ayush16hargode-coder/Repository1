import random
# this is a basic version, updates are on the way
a1 = """Which function is used to display output in Python?
            A) input()
            B) print()
            C) output()
            D) display()"""
b1 = """What is the output of the following code?
            x = 5
            print(type(x))
            A) <class 'int'>
            B) <class 'float'>
            C) <class 'str'>
            D) Error"""
c1 = """Which symbol is used for single-line comments in Python?"
            A) //
            B) /* */
            C) #
            D) --"""
d1 = """"What is the output of the following code?
            a = "Python"
            print(a[0])
            A) y
            B) P
            C) n
            D) Error"""
e1 = """Which of the following data types is mutable in Python?
            A) Tuple
            B) String
            C) List
            D) Integer"""
ques = [a1,b1,c1,d1,e1]

a2 = "B"
b2 = "A"
c2 = "C"
d2 = "B"
e2 = "C"
ans = [a2,b2,c2,d2,e2]
uans = []
k = 0

while ques:
    k += 1
    que = random.choice(ques)
    ques.remove(que)
    print(f"Question {k}:  {que}")
    answer = input("Enter the correct option as answer (NOTE!! Please only entre option as capital letter)\n")
    uans.append(answer)

check = sorted(uans) == sorted(ans)
if (check == True):
    print("The answer is correct!")
else:
    print("The answer is incorrect!")








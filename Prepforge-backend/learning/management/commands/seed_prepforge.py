from django.core.management.base import BaseCommand
from django.db import transaction

from learning.models import Category, Topic, LearningContent
from coding.models import CodingProblem, TestCase
from interviews.models import InterviewQuestion


class Command(BaseCommand):
    help = "Populate PrepForge content database with learning, coding and interview content."

    def handle(self, *args, **options):

        with transaction.atomic(using="content"):

            # =========================================================
            # TOPICS
            # =========================================================

            topics = {}

            topic_data = {
                "dsa": [
                    ("Arrays", "arrays", "Learn array fundamentals and common problem-solving patterns."),
                    ("Strings", "strings", "Learn string manipulation and string algorithms."),
                    ("Linked Lists", "linked-lists", "Understand linked-list structures and operations."),
                    ("Stacks & Queues", "stacks-queues", "Learn LIFO and FIFO data structures."),
                    ("Trees", "trees", "Learn binary trees, BSTs and tree traversal."),
                    ("Graphs", "graphs", "Learn graph representations and traversal algorithms."),
                    ("Dynamic Programming", "dynamic-programming", "Learn state-based optimization techniques."),
                ],
                "core-cs": [
                    ("Object Oriented Programming", "oop", "Core object-oriented programming concepts."),
                    ("DBMS", "dbms", "Database fundamentals, SQL and normalization."),
                    ("Operating Systems", "operating-systems", "Processes, threads, memory and scheduling."),
                    ("Computer Networks", "computer-networks", "Networking fundamentals and protocols."),
                ],
                "backend": [
                    ("Django", "django", "Django fundamentals for backend development."),
                    ("REST APIs", "rest-apis", "Design and consume RESTful APIs."),
                    ("Authentication", "authentication", "Authentication and authorization concepts."),
                    ("Databases", "databases", "Database design and backend integration."),
                ],
            }

            for category_slug, items in topic_data.items():

                category = Category.objects.using("content").filter(
                    slug=category_slug
                ).first()

                if not category:
                    self.stdout.write(
                        self.style.WARNING(
                            f"Category '{category_slug}' not found. Skipping."
                        )
                    )
                    continue

                for name, slug, description in items:

                    topic, _ = Topic.objects.using("content").get_or_create(
                        category_id=category.id,
                        slug=slug,
                        defaults={
                            "name": name,
                            "description": description,
                        }
                    )

                    topics[slug] = topic

            # =========================================================
            # LEARNING CONTENT
            # =========================================================

            lessons = [
                # Arrays
                (
                    "arrays",
                    "Introduction to Arrays",
                    "arrays-introduction",
                    """An array stores elements in contiguous memory locations.

Arrays provide constant-time access by index, making them useful when fast positional access is required.

Important operations include traversal, insertion, deletion and searching.

For interviews, understand the time complexity of each operation."""
                ),
                (
                    "arrays",
                    "Array Traversal",
                    "array-traversal",
                    """Array traversal means visiting every element of an array.

A simple loop is usually used.

The time complexity of traversing an array containing n elements is O(n)."""
                ),
                (
                    "arrays",
                    "Two Pointer Technique",
                    "two-pointer-technique",
                    """The two-pointer technique uses two indexes to process an array efficiently.

A common example is searching for a pair of values with a particular sum.

Instead of checking every pair using O(n²), a sorted array can often be processed in O(n)."""
                ),
                (
                    "arrays",
                    "Sliding Window",
                    "sliding-window",
                    """Sliding window is useful for contiguous subarray or substring problems.

A window is expanded or contracted while maintaining the required condition.

Many problems that appear O(n²) can be reduced to O(n)."""
                ),
                (
                    "arrays",
                    "Prefix Sum",
                    "prefix-sum",
                    """Prefix sums store cumulative values.

For an array, prefix[i] can represent the sum of elements from the beginning through index i.

This allows many range-sum queries to be answered efficiently."""
                ),

                # Strings
                (
                    "strings",
                    "String Fundamentals",
                    "string-fundamentals",
                    """Strings are sequences of characters.

Interview questions commonly involve traversal, comparison, frequency counting, reversal and substring operations.

Always consider whether a hash map or array of character frequencies can reduce complexity."""
                ),
                (
                    "strings",
                    "String Reversal",
                    "string-reversal",
                    """A string can be reversed by processing characters from the end toward the beginning.

Another common interview approach uses two pointers when working with a mutable character representation."""
                ),
                (
                    "strings",
                    "Character Frequency",
                    "character-frequency",
                    """Frequency counting is useful for anagram, duplicate-character and counting problems.

A hash map or fixed-size frequency array can store the number of occurrences of each character."""
                ),
                (
                    "strings",
                    "Palindrome Checking",
                    "palindrome-checking",
                    """A palindrome reads the same from left to right and right to left.

Two pointers can compare characters from both ends and move toward the center.

The typical time complexity is O(n)."""
                ),

                # Linked Lists
                (
                    "linked-lists",
                    "Linked List Fundamentals",
                    "linked-list-fundamentals",
                    """A linked list consists of nodes where each node stores data and a reference to another node.

Unlike arrays, linked-list elements are not required to occupy contiguous memory."""
                ),
                (
                    "linked-lists",
                    "Insert and Delete in Linked Lists",
                    "linked-list-insert-delete",
                    """Insertion and deletion can be efficient when a reference to the relevant node is available.

Finding a node by position generally requires traversal and takes O(n)."""
                ),
                (
                    "linked-lists",
                    "Fast and Slow Pointers",
                    "fast-slow-pointers",
                    """Fast and slow pointers use two references moving at different speeds.

This technique is commonly used to detect cycles and find the middle node of a linked list."""
                ),

                # Stack / Queue
                (
                    "stacks-queues",
                    "Stack Fundamentals",
                    "stack-fundamentals",
                    """A stack follows LIFO: Last In, First Out.

Typical operations are push, pop and peek.

Stacks are frequently used for parentheses matching, recursion simulation and expression evaluation."""
                ),
                (
                    "stacks-queues",
                    "Queue Fundamentals",
                    "queue-fundamentals",
                    """A queue follows FIFO: First In, First Out.

Queues are commonly used in scheduling, breadth-first search and task processing."""
                ),

                # Trees
                (
                    "trees",
                    "Binary Tree Fundamentals",
                    "binary-tree-fundamentals",
                    """A binary tree is a tree where each node has at most two children.

The children are commonly called left and right children."""
                ),
                (
                    "trees",
                    "Tree Traversals",
                    "tree-traversals",
                    """The common depth-first traversals are preorder, inorder and postorder.

Breadth-first traversal processes nodes level by level using a queue."""
                ),

                # Graphs
                (
                    "graphs",
                    "Graph Fundamentals",
                    "graph-fundamentals",
                    """A graph consists of vertices and edges.

Graphs can be directed or undirected and weighted or unweighted.

Common representations include adjacency lists and adjacency matrices."""
                ),
                (
                    "graphs",
                    "Breadth First Search",
                    "breadth-first-search",
                    """BFS explores a graph level by level.

It normally uses a queue and is useful for shortest paths in unweighted graphs."""
                ),
                (
                    "graphs",
                    "Depth First Search",
                    "depth-first-search",
                    """DFS explores as far as possible along a branch before backtracking.

It can be implemented recursively or with an explicit stack."""
                ),

                # DP
                (
                    "dynamic-programming",
                    "Dynamic Programming Fundamentals",
                    "dynamic-programming-fundamentals",
                    """Dynamic programming solves problems by storing results of overlapping subproblems.

Two common approaches are memoization and tabulation."""
                ),
                (
                    "dynamic-programming",
                    "Climbing Stairs",
                    "climbing-stairs",
                    """The climbing stairs problem demonstrates how a problem can be represented using previous states.

The number of ways to reach step n depends on the ways to reach earlier steps."""
                ),

                # OOP
                (
                    "oop",
                    "Classes and Objects",
                    "classes-and-objects",
                    """A class defines the structure and behavior of objects.

An object is an instance of a class.

Classes help organize state and behavior into reusable units."""
                ),
                (
                    "oop",
                    "Inheritance",
                    "inheritance",
                    """Inheritance allows a class to derive behavior and properties from another class.

It supports reuse and represents an IS-A relationship."""
                ),
                (
                    "oop",
                    "Polymorphism",
                    "polymorphism",
                    """Polymorphism allows the same interface or method call to represent different implementations.

Method overriding is a common example."""
                ),

                # DBMS
                (
                    "dbms",
                    "Database Normalization",
                    "database-normalization",
                    """Normalization organizes relational data to reduce unnecessary duplication and update anomalies.

Common normal forms include 1NF, 2NF and 3NF."""
                ),
                (
                    "dbms",
                    "SQL Joins",
                    "sql-joins",
                    """SQL joins combine rows from multiple tables.

Common joins include INNER JOIN, LEFT JOIN, RIGHT JOIN and FULL OUTER JOIN."""
                ),

                # OS
                (
                    "operating-systems",
                    "Processes and Threads",
                    "processes-and-threads",
                    """A process is an executing program with its own address space.

Threads are execution units within a process and can share process resources."""
                ),
                (
                    "operating-systems",
                    "CPU Scheduling",
                    "cpu-scheduling",
                    """CPU scheduling determines which process or thread gets CPU time.

Common algorithms include FCFS, SJF, Round Robin and Priority Scheduling."""
                ),

                # Networks
                (
                    "computer-networks",
                    "HTTP and HTTPS",
                    "http-https",
                    """HTTP is an application-layer protocol used for communication between clients and servers.

HTTPS adds TLS encryption to protect data transmitted over HTTP."""
                ),

                # Django
                (
                    "django",
                    "Django Project Structure",
                    "django-project-structure",
                    """A Django project contains configuration for the overall application.

Django apps organize functionality into reusable components containing models, views, URLs and other files."""
                ),
                (
                    "django",
                    "Django Models",
                    "django-models",
                    """Django models represent application data using Python classes.

Django's ORM allows developers to create, query and update database records using Python."""
                ),
                (
                    "django",
                    "Django REST Framework",
                    "django-rest-framework",
                    """Django REST Framework provides tools for building APIs.

Serializers convert between complex data types and representations such as JSON."""
                ),
                (
                    "rest-apis",
                    "REST API Fundamentals",
                    "rest-api-fundamentals",
                    """REST APIs expose resources through HTTP.

Common methods include GET, POST, PUT, PATCH and DELETE."""
                ),
            ]

            lesson_order = {}

            for topic_slug, title, slug, content in lessons:

                topic = topics.get(topic_slug)

                if not topic:
                    continue

                count = lesson_order.get(topic_slug, 0) + 1
                lesson_order[topic_slug] = count

                LearningContent.objects.using("content").get_or_create(
                    topic_id=topic.id,
                    slug=slug,
                    defaults={
                        "title": title,
                        "content": content,
                        "order": count,
                    }
                )

            # =========================================================
            # CODING PROBLEMS
            # =========================================================

            coding_problems = [
                {
                    "title": "Contains Duplicate",
                    "slug": "contains-duplicate",
                    "topic": "arrays",
                    "difficulty": "Easy",
                    "description": "Given an integer array, determine whether any value appears at least twice.",
                    "input_format": "An integer array nums.",
                    "output_format": "Return true if a duplicate exists, otherwise false.",
                    "constraints": "1 <= nums.length <= 100000",
                    "starter_code": "def contains_duplicate(nums):\n    pass",
                    "solution_explanation": "Use a set. If an element already exists in the set, a duplicate has been found.",
                    "tests": [
                        ("[1,2,3,1]", "true"),
                        ("[1,2,3,4]", "false"),
                        ("[1,1]", "true"),
                    ],
                },
                {
                    "title": "Valid Anagram",
                    "slug": "valid-anagram",
                    "topic": "strings",
                    "difficulty": "Easy",
                    "description": "Given two strings, determine whether they are anagrams of each other.",
                    "input_format": "Two strings s and t.",
                    "output_format": "Return true if s and t are anagrams.",
                    "constraints": "Strings contain lowercase English letters.",
                    "starter_code": "def is_anagram(s, t):\n    pass",
                    "solution_explanation": "Compare character frequencies in both strings.",
                    "tests": [
                        ('"anagram", "nagaram"', "true"),
                        ('"rat", "car"', "false"),
                        ('"listen", "silent"', "true"),
                    ],
                },
                {
                    "title": "Palindrome Number",
                    "slug": "palindrome-number",
                    "topic": "strings",
                    "difficulty": "Easy",
                    "description": "Determine whether an integer reads the same forward and backward.",
                    "input_format": "An integer x.",
                    "output_format": "Return true if x is a palindrome.",
                    "constraints": "-2^31 <= x <= 2^31 - 1",
                    "starter_code": "def is_palindrome(x):\n    pass",
                    "solution_explanation": "Reverse the number or compare its string representation.",
                    "tests": [
                        ("121", "true"),
                        ("-121", "false"),
                        ("10", "false"),
                    ],
                },
                {
                    "title": "Best Time to Buy and Sell Stock",
                    "slug": "best-time-to-buy-and-sell-stock",
                    "topic": "arrays",
                    "difficulty": "Easy",
                    "description": "Find the maximum profit from buying and selling a stock once.",
                    "input_format": "An array of daily stock prices.",
                    "output_format": "Return the maximum possible profit.",
                    "constraints": "1 <= prices.length <= 100000",
                    "starter_code": "def max_profit(prices):\n    pass",
                    "solution_explanation": "Track the minimum price seen so far and the maximum profit.",
                    "tests": [
                        ("[7,1,5,3,6,4]", "5"),
                        ("[7,6,4,3,1]", "0"),
                    ],
                },
                {
                    "title": "Merge Sorted Arrays",
                    "slug": "merge-sorted-arrays",
                    "topic": "arrays",
                    "difficulty": "Easy",
                    "description": "Merge two sorted arrays into one sorted array.",
                    "input_format": "Two sorted integer arrays.",
                    "output_format": "Return the merged sorted array.",
                    "constraints": "Arrays contain integers.",
                    "starter_code": "def merge_arrays(a, b):\n    pass",
                    "solution_explanation": "Use two pointers and repeatedly select the smaller current element.",
                    "tests": [
                        ("[1,3,5], [2,4,6]", "[1,2,3,4,5,6]"),
                        ("[1], [2]", "[1,2]"),
                    ],
                },
                {
                    "title": "Move Zeroes",
                    "slug": "move-zeroes",
                    "topic": "arrays",
                    "difficulty": "Easy",
                    "description": "Move all zero values to the end while maintaining the order of non-zero elements.",
                    "input_format": "An integer array.",
                    "output_format": "Return the modified array.",
                    "constraints": "1 <= nums.length <= 100000",
                    "starter_code": "def move_zeroes(nums):\n    pass",
                    "solution_explanation": "Maintain a position for the next non-zero value.",
                    "tests": [
                        ("[0,1,0,3,12]", "[1,3,12,0,0]"),
                        ("[0]", "[0]"),
                    ],
                },
                {
                    "title": "Maximum Product Subarray",
                    "slug": "maximum-product-subarray",
                    "topic": "arrays",
                    "difficulty": "Medium",
                    "description": "Find the contiguous subarray with the largest product.",
                    "input_format": "An integer array.",
                    "output_format": "Return the maximum product.",
                    "constraints": "Array contains positive, negative and zero values.",
                    "starter_code": "def max_product(nums):\n    pass",
                    "solution_explanation": "Track both maximum and minimum products because multiplying by a negative value can swap their roles.",
                    "tests": [
                        ("[2,3,-2,4]", "6"),
                        ("[-2,0,-1]", "0"),
                    ],
                },
                {
                    "title": "Majority Element",
                    "slug": "majority-element",
                    "topic": "arrays",
                    "difficulty": "Easy",
                    "description": "Find the element that appears more than half the length of the array.",
                    "input_format": "An integer array.",
                    "output_format": "Return the majority element.",
                    "constraints": "A majority element always exists.",
                    "starter_code": "def majority_element(nums):\n    pass",
                    "solution_explanation": "Boyer-Moore voting algorithm finds the majority element in O(n) time and O(1) space.",
                    "tests": [
                        ("[3,2,3]", "3"),
                        ("[2,2,1,1,1,2,2]", "2"),
                    ],
                },
                {
                    "title": "Merge Two Sorted Linked Lists",
                    "slug": "merge-two-sorted-linked-lists",
                    "topic": "linked-lists",
                    "difficulty": "Easy",
                    "description": "Merge two sorted linked lists into one sorted linked list.",
                    "input_format": "Two sorted linked lists.",
                    "output_format": "Return the merged sorted list.",
                    "constraints": "Lists are sorted in ascending order.",
                    "starter_code": "def merge_lists(a, b):\n    pass",
                    "solution_explanation": "Use a dummy node and repeatedly attach the smaller node.",
                    "tests": [
                        ("[1,2,4], [1,3,4]", "[1,1,2,3,4,4]"),
                        ("[], []", "[]"),
                    ],
                },
                    {
                    "title": "Reverse Linked List",
                    "slug": "reverse-linked-list",
                    "topic": "linked-lists",
                    "difficulty": "Easy",
                    "description": "Reverse a singly linked list.",
                    "input_format": "A singly linked list.",
                    "output_format": "Return the reversed list.",
                    "constraints": "The list may be empty.",
                    "starter_code": "def reverse_list(head):\n    pass",
                    "solution_explanation": "Iteratively reverse each next pointer using previous and current references.",
                    "tests": [
                        ("[1,2,3,4,5]", "[5,4,3,2,1]"),
                        ("[1]", "[1]"),
                    ],
                },
                {
                    "title": "Valid Parentheses",
                    "slug": "valid-parentheses-extra",
                    "topic": "stacks-queues",
                    "difficulty": "Easy",
                    "description": "Determine whether brackets in a string are correctly matched.",
                    "input_format": "A string containing brackets.",
                    "output_format": "Return true if brackets are valid.",
                    "constraints": "Characters are (, ), {, }, [, ].",
                    "starter_code": "def valid_parentheses(s):\n    pass",
                    "solution_explanation": "Use a stack. Push opening brackets and verify each closing bracket against the top.",
                    "tests": [
                        ('"()"', "true"),
                        ('"()[]{}"', "true"),
                        ('"(]"', "false"),
                    ],
                },
                {
                    "title": "Implement Queue Using Stacks",
                    "slug": "queue-using-stacks",
                    "topic": "stacks-queues",
                    "difficulty": "Easy",
                    "description": "Implement FIFO queue behavior using stacks.",
                    "input_format": "A sequence of queue operations.",
                    "output_format": "Process the operations according to queue semantics.",
                    "constraints": "Use stack operations.",
                    "starter_code": "class MyQueue:\n    def __init__(self):\n        pass",
                    "solution_explanation": "Use an input stack and output stack. Transfer elements when the output stack is empty.",
                    "tests": [
                        ("push(1), push(2), pop()", "1"),
                        ("push(5), peek()", "5"),
                    ],
                },
                {
                    "title": "Binary Tree Inorder Traversal",
                    "slug": "binary-tree-inorder-traversal",
                    "topic": "trees",
                    "difficulty": "Easy",
                    "description": "Return the inorder traversal of a binary tree.",
                    "input_format": "A binary tree.",
                    "output_format": "Return node values in inorder.",
                    "constraints": "Visit left subtree, root, then right subtree.",
                    "starter_code": "def inorder(root):\n    pass",
                    "solution_explanation": "Use recursion or an explicit stack to process left-root-right.",
                    "tests": [
                        ("[1,null,2,3]", "[1,3,2]"),
                        ("[]", "[]"),
                    ],
                },
                {
                    "title": "Maximum Depth of Binary Tree",
                    "slug": "maximum-depth-binary-tree",
                    "topic": "trees",
                    "difficulty": "Easy",
                    "description": "Find the maximum depth of a binary tree.",
                    "input_format": "A binary tree.",
                    "output_format": "Return its maximum depth.",
                    "constraints": "The tree can be empty.",
                    "starter_code": "def max_depth(root):\n    pass",
                    "solution_explanation": "The depth is one plus the maximum depth of the left and right subtrees.",
                    "tests": [
                        ("[3,9,20,null,null,15,7]", "3"),
                        ("[1,null,2]", "2"),
                    ],
                },
                {
                    "title": "Number of Islands",
                    "slug": "number-of-islands",
                    "topic": "graphs",
                    "difficulty": "Medium",
                    "description": "Count the number of connected groups of land in a binary grid.",
                    "input_format": "A grid containing 0 and 1.",
                    "output_format": "Return the number of islands.",
                    "constraints": "Adjacent means horizontally or vertically connected.",
                    "starter_code": "def num_islands(grid):\n    pass",
                    "solution_explanation": "Run DFS or BFS from every unvisited land cell.",
                    "tests": [
                        ('[["1","1","0"],["1","0","0"],["0","0","1"]]', "2"),
                        ('[["1","1"],["1","1"]]', "1"),
                    ],
                },
                {
                    "title": "Flood Fill",
                    "slug": "flood-fill",
                    "topic": "graphs",
                    "difficulty": "Easy",
                    "description": "Change the color of a connected region starting from a given cell.",
                    "input_format": "An image grid, starting row and column, and new color.",
                    "output_format": "Return the updated image.",
                    "constraints": "Connected cells have the same original color.",
                    "starter_code": "def flood_fill(image, sr, sc, color):\n    pass",
                    "solution_explanation": "Use DFS or BFS to visit all connected cells with the original color.",
                    "tests": [
                        ('[[1,1,1],[1,1,0],[1,0,1]], 1, 1, 2', "[[2,2,2],[2,2,0],[2,0,1]]"),
                    ],
                },
                {
                    "title": "Climbing Stairs",
                    "slug": "climbing-stairs",
                    "topic": "dynamic-programming",
                    "difficulty": "Easy",
                    "description": "Count the number of distinct ways to climb n stairs when taking one or two steps at a time.",
                    "input_format": "An integer n.",
                    "output_format": "Return the number of distinct ways.",
                    "constraints": "1 <= n <= 45",
                    "starter_code": "def climb_stairs(n):\n    pass",
                    "solution_explanation": "The problem follows the Fibonacci recurrence: ways[n] = ways[n-1] + ways[n-2].",
                    "tests": [
                        ("2", "2"),
                        ("3", "3"),
                        ("5", "8"),
                    ],
                },
                {
                    "title": "House Robber",
                    "slug": "house-robber",
                    "topic": "dynamic-programming",
                    "difficulty": "Medium",
                    "description": "Find the maximum amount that can be robbed without robbing adjacent houses.",
                    "input_format": "An array of house amounts.",
                    "output_format": "Return the maximum amount.",
                    "constraints": "Cannot select adjacent houses.",
                    "starter_code": "def rob(nums):\n    pass",
                    "solution_explanation": "For each house, choose between skipping it and taking it plus the best result two positions earlier.",
                    "tests": [
                        ("[1,2,3,1]", "4"),
                        ("[2,7,9,3,1]", "12"),
                    ],
                },
                {
                    "title": "Fibonacci Number",
                    "slug": "fibonacci-number",
                    "topic": "dynamic-programming",
                    "difficulty": "Easy",
                    "description": "Calculate the nth Fibonacci number.",
                    "input_format": "An integer n.",
                    "output_format": "Return the nth Fibonacci number.",
                    "constraints": "0 <= n <= 30",
                    "starter_code": "def fib(n):\n    pass",
                    "solution_explanation": "Use iterative dynamic programming to avoid repeated recursive calculations.",
                    "tests": [
                        ("2", "1"),
                        ("5", "5"),
                        ("10", "55"),
                    ],
                },
                {
                    "title": "Valid Binary Search Tree",
                    "slug": "valid-binary-search-tree",
                    "topic": "trees",
                    "difficulty": "Medium",
                    "description": "Determine whether a binary tree satisfies the binary search tree property.",
                    "input_format": "A binary tree.",
                    "output_format": "Return true if it is a valid BST.",
                    "constraints": "Left values must be smaller and right values larger within valid bounds.",
                    "starter_code": "def is_valid_bst(root):\n    pass",
                    "solution_explanation": "Validate every node against an allowed minimum and maximum range.",
                    "tests": [
                        ("[2,1,3]", "true"),
                        ("[5,1,4,null,null,3,6]", "false"),
                    ],
                },
                {
                    "title": "Search in Rotated Sorted Array",
                    "slug": "search-rotated-sorted-array",
                    "topic": "arrays",
                    "difficulty": "Medium",
                    "description": "Search for a target in a rotated sorted array.",
                    "input_format": "A rotated sorted integer array and target.",
                    "output_format": "Return the target index or -1.",
                    "constraints": "Values are distinct.",
                    "starter_code": "def search(nums, target):\n    pass",
                    "solution_explanation": "Modified binary search determines which half is sorted at every step.",
                    "tests": [
                        ("[4,5,6,7,0,1,2], 0", "4"),
                        ("[4,5,6,7,0,1,2], 3", "-1"),
                    ],
                },
                {
                    "title": "Longest Substring Without Repeating Characters",
                    "slug": "longest-substring-without-repeating-characters",
                    "topic": "strings",
                    "difficulty": "Medium",
                    "description": "Find the length of the longest substring without repeating characters.",
                    "input_format": "A string s.",
                    "output_format": "Return the maximum length.",
                    "constraints": "The string may contain letters, digits and symbols.",
                    "starter_code": "def length_of_longest_substring(s):\n    pass",
                    "solution_explanation": "Use a sliding window and a set or map to maintain unique characters.",
                    "tests": [
                        ('"abcabcbb"', "3"),
                        ('"bbbbb"', "1"),
                        ('"pwwkew"', "3"),
                    ],
                },
                {
                    "title": "Product of Array Except Self",
                    "slug": "product-of-array-except-self",
                    "topic": "arrays",
                    "difficulty": "Medium",
                    "description": "Return an array where each position contains the product of every other element.",
                    "input_format": "An integer array.",
                    "output_format": "Return the product array without using division.",
                    "constraints": "Use O(n) time.",
                    "starter_code": "def product_except_self(nums):\n    pass",
                    "solution_explanation": "Use prefix products followed by suffix products to achieve O(n) time.",
                    "tests": [
                        ("[1,2,3,4]", "[24,12,8,6]"),
                        ("[-1,1,0,-3,3]", "[0,0,9,0,0]"),
                    ],
                },
                {
                    "title": "Group Anagrams",
                    "slug": "group-anagrams",
                    "topic": "strings",
                    "difficulty": "Medium",
                    "description": "Group strings that are anagrams of one another.",
                    "input_format": "An array of strings.",
                    "output_format": "Return groups of anagrams.",
                    "constraints": "Strings contain lowercase English letters.",
                    "starter_code": "def group_anagrams(strs):\n    pass",
                    "solution_explanation": "Use the sorted string or character frequency tuple as a dictionary key.",
                    "tests": [
                        ('["eat","tea","tan","ate","nat","bat"]', '[["eat","tea","ate"],["tan","nat"],["bat"]]'),
                    ],
                },
                {
                    "title": "Min Stack",
                    "slug": "min-stack",
                    "topic": "stacks-queues",
                    "difficulty": "Medium",
                    "description": "Design a stack that supports retrieving the minimum element in constant time.",
                    "input_format": "Stack operations.",
                    "output_format": "Support push, pop, top and minimum retrieval.",
                    "constraints": "All required operations should be O(1).",
                    "starter_code": "class MinStack:\n    def __init__(self):\n        pass",
                    "solution_explanation": "Maintain an additional stack containing the minimum value at each level.",
                    "tests": [
                        ("push(-2), push(0), push(-3), getMin()", "-3"),
                    ],
                },
            ]

            for item in coding_problems:

                topic = topics.get(item["topic"])

                if not topic:
                    continue

                problem, created = CodingProblem.objects.using(
                    "content"
                ).get_or_create(
                    slug=item["slug"],
                    defaults={
                        "title": item["title"],
                        "topic_id": topic.id,
                        "description": item["description"],
                        "input_format": item["input_format"],
                        "output_format": item["output_format"],
                        "constraints": item["constraints"],
                        "difficulty": item["difficulty"],
                        "starter_code": item["starter_code"],
                        "solution_explanation": item["solution_explanation"],
                    }
                )

                # Only add test cases when this problem has none.
                if not TestCase.objects.using("content").filter(
                    problem_id=problem.id
                ).exists():

                    for input_data, expected_output in item["tests"]:
                        TestCase.objects.using("content").create(
                            problem_id=problem.id,
                            input_data=input_data,
                            expected_output=expected_output,
                            is_hidden=True,
                        )

            # =========================================================
            # INTERVIEW QUESTIONS
            # =========================================================

            interview_questions = [
                ("What are the four pillars of OOP?", "Technical", "oop", "Easy",
                 "Encapsulation, abstraction, inheritance and polymorphism are the commonly cited four pillars of object-oriented programming."),

                ("What is encapsulation?", "Technical", "oop", "Easy",
                 "Encapsulation bundles data and behavior and controls access to internal state."),

                ("What is inheritance?", "Technical", "oop", "Easy",
                 "Inheritance allows a class to derive properties and behavior from another class."),

                ("What is polymorphism?", "Technical", "oop", "Easy",
                 "Polymorphism allows the same interface to have different implementations."),

                ("What is abstraction?", "Technical", "oop", "Easy",
                 "Abstraction exposes essential behavior while hiding unnecessary implementation details."),

                ("What is the difference between an interface and an abstract class?", "Technical", "oop", "Medium",
                 "An interface primarily defines a contract, while an abstract class can provide shared state and implementation."),

                ("What is method overloading?", "Technical", "oop", "Easy",
                 "Method overloading means providing multiple methods with the same name but different parameter lists, where supported."),

                ("What is method overriding?", "Technical", "oop", "Easy",
                 "Method overriding occurs when a subclass provides its own implementation of an inherited method."),

                ("What is the difference between a process and a thread?", "Technical", "operating-systems", "Medium",
                 "Processes have separate address spaces, while threads within the same process can share memory and resources."),

                ("What is a deadlock?", "Technical", "operating-systems", "Medium",
                 "A deadlock occurs when processes or threads wait indefinitely for resources held by one another."),

                ("What are the necessary conditions for deadlock?", "Technical", "operating-systems", "Medium",
                 "The four classic conditions are mutual exclusion, hold and wait, no preemption and circular wait."),

                ("What is virtual memory?", "Technical", "operating-systems", "Medium",
                 "Virtual memory provides processes with an abstraction of memory and can use disk storage to extend available address space."),

                ("What is context switching?", "Technical", "operating-systems", "Easy",
                 "Context switching saves the state of one execution context and restores another so the CPU can switch tasks."),

                ("What is database normalization?", "Technical", "dbms", "Easy",
                 "Normalization structures relational data to reduce redundancy and prevent update anomalies."),

                ("What is a primary key?", "Technical", "dbms", "Easy",
                 "A primary key uniquely identifies a row in a relational table."),

                ("What is a foreign key?", "Technical", "dbms", "Easy",
                 "A foreign key references a key in another table and represents a relationship between tables."),

                ("What are ACID properties?", "Technical", "dbms", "Medium",
                 "ACID stands for Atomicity, Consistency, Isolation and Durability."),

                ("What is the difference between DELETE, TRUNCATE and DROP?", "Technical", "dbms", "Medium",
                 "DELETE removes selected rows, TRUNCATE removes table rows efficiently, and DROP removes the table structure itself."),

                ("What is an SQL JOIN?", "Technical", "dbms", "Easy",
                 "A JOIN combines related rows from multiple tables."),

                ("What is indexing in a database?", "Technical", "dbms", "Medium",
                 "An index is a data structure that can improve lookup performance at the cost of storage and write overhead."),

                ("Explain the difference between GET and POST.", "Technical", "rest-apis", "Easy",
                 "GET is commonly used to retrieve resources while POST is commonly used to submit data or create a resource."),

                ("What is REST?", "Technical", "rest-apis", "Easy",
                 "REST is an architectural style for designing networked APIs around resources and standard HTTP semantics."),

                ("What are HTTP status codes?", "Technical", "rest-apis", "Easy",
                 "HTTP status codes communicate the result of a request, such as 200 for success, 404 for not found and 500 for server errors."),

                ("What is the difference between PUT and PATCH?", "Technical", "rest-apis", "Medium",
                 "PUT is generally used for replacing a resource representation while PATCH is used for partial updates."),

                ("What is JWT authentication?", "Technical", "authentication", "Medium",
                 "JWT uses signed tokens containing claims that can be presented to authenticate API requests."),

                ("What is the difference between authentication and authorization?", "Technical", "authentication", "Easy",
                 "Authentication determines who a user is; authorization determines what that user is allowed to do."),

                ("What is Django ORM?", "Technical", "django", "Easy",
                 "Django ORM allows database operations using Python model classes instead of writing every SQL query manually."),

                ("What is Django middleware?", "Technical", "django", "Medium",
                 "Middleware is a layer that processes requests and responses globally around Django views."),

                ("What is a Django model?", "Technical", "django", "Easy",
                 "A Django model is a Python class representing application data and database structure."),

                ("What is Django REST Framework?", "Technical", "django", "Easy",
                 "DRF is a toolkit for building Web APIs with Django."),

                ("Tell me about yourself.", "Behavioral", None, "Easy",
                 "Give a concise introduction covering your education, technical skills, projects and the type of role you are targeting."),

                ("Why do you want to work in software development?", "Behavioral", None, "Easy",
                 "Explain your interest in building software, solving problems and continuously developing technical skills."),

                ("Why should we hire you?", "Behavioral", None, "Medium",
                 "Connect your technical skills, project experience, learning ability and willingness to contribute to the role."),

                ("What are your strengths?", "Behavioral", None, "Easy",
                 "Choose strengths relevant to the role and support them with concrete examples."),

                ("What is one area you are currently improving?", "Behavioral", None, "Easy",
                 "Choose a genuine development area and explain the specific steps you are taking to improve."),

                ("Describe a difficult problem you solved.", "Behavioral", None, "Medium",
                 "Use the STAR structure: Situation, Task, Action and Result."),

                ("Tell me about a time you worked in a team.", "Behavioral", None, "Medium",
                 "Explain the team situation, your responsibility, how you collaborated and what the result was."),

                ("How do you handle deadlines?", "Behavioral", None, "Easy",
                 "Explain how you prioritize tasks, estimate work, communicate risks and track progress."),

                ("Where do you see yourself in five years?", "Behavioral", None, "Easy",
                 "Discuss realistic professional growth, deeper technical expertise and increasing responsibility."),

                ("Why do you want to join our company?", "Behavioral", None, "Easy",
                 "Connect the company's products, engineering culture or opportunities with your professional goals."),
            ]

            for title, question_type, topic_slug, difficulty, answer in interview_questions:

                topic_id = None

                if topic_slug:
                    topic = topics.get(topic_slug)

                    if topic:
                        topic_id = topic.id

                InterviewQuestion.objects.using(
                    "content"
                ).get_or_create(
                    title=title,
                    defaults={
                        "question_type": question_type,
                        "topic_id": topic_id,
                        "difficulty": difficulty,
                        "answer": answer,
                    }
                )

        # =============================================================
        # FINAL COUNTS
        # =============================================================

        self.stdout.write("")
        self.stdout.write(
            self.style.SUCCESS("PrepForge content seeding completed!")
        )

        self.stdout.write(
            f"Categories: {Category.objects.using('content').count()}"
        )

        self.stdout.write(
            f"Topics: {Topic.objects.using('content').count()}"
        )

        self.stdout.write(
            f"Learning lessons: {LearningContent.objects.using('content').count()}"
        )

        self.stdout.write(
            f"Coding problems: {CodingProblem.objects.using('content').count()}"
        )

        self.stdout.write(
            f"Test cases: {TestCase.objects.using('content').count()}"
        )

        self.stdout.write(
            f"Interview questions: {InterviewQuestion.objects.using('content').count()}"
        )
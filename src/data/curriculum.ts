import type { Chapter, LessonItem, SandboxTemplate } from '../types/python.ts';

export const CHAPTERS: Chapter[] = [
  {
    id: 'basics',
    numberLabel: '01',
    title: '變數、型別與字串處理',
    description: '掌握 Python 基本輸出入、資料型別轉換、f-string 排版與字串切片技巧。',
  },
  {
    id: 'control-flow',
    numberLabel: '02',
    title: '條件判斷與邏輯分支',
    description: '運用 if / elif / else 搭配布林運算子，設計嚴謹的決策流程。',
  },
  {
    id: 'loops',
    numberLabel: '03',
    title: '迴圈與重複運算結構',
    description: '精通 for、while 與巢狀迴圈，處理數列累加與圖形輸出問題。',
  },
  {
    id: 'collections',
    numberLabel: '04',
    title: '串列、推導式與字典',
    description: '靈活操作 list 切片與串列推導式，並使用 dict 高效建立鍵值統計表。',
  },
  {
    id: 'functions',
    numberLabel: '05',
    title: '函式抽象與遞迴思維',
    description: '學習設計可重複使用的函式、預設參數、多值回傳與經典費氏數列。',
  },
  {
    id: 'challenges',
    numberLabel: '06',
    title: '綜合實戰演算法挑戰',
    description: '整合迴圈、資料結構與條件邏輯，完成質數篩選、結帳計價與迴文檢查。',
  },
];

export const LESSONS: LessonItem[] = [
  {
    id: 'py-101',
    chapterId: 'basics',
    orderLabel: '1.1',
    title: 'print() 與 f-string 格式化輸出',
    difficulty: '入門',
    estimatedMinutes: 8,
    summary: '學習建立變數並透過 f-string 將變數直接嵌入字串中整齊輸出。',
    visualizer: 'variables',
    concepts: [
      {
        heading: '變數賦值與型別推斷',
        body: 'Python 不需要事先宣告變數型別，使用等號 = 即可將數值或字串指派給變數名稱。',
        exampleCode: 'language = "Python"\nversion = 3.10\nprint(language, version)',
      },
      {
        heading: '使用 f-string 嵌入變數',
        body: '在引號前加上 f，並用大括號 {變數名稱} 包住運算式，是最現代且可讀性最高的排版語法。',
        exampleCode: 'user = "小安"\nscore = 98\nprint(f"{user} 本次測驗得分為 {score} 分")',
      },
    ],
    exerciseTitle: '打造個人歡迎訊息',
    exercisePrompt:
      '請建立兩個變數：name（字串，值為 "Python"）與 version（整數，值為 3），並使用 f-string 印出精確文字：\nHello Python 3!',
    starterCode: '# 請在下方建立變數並使用 f-string 輸出\nname = "Python"\nversion = 3\n\n# 使用 print(f"...") 印出結果\n',
    solutionCode: 'name = "Python"\nversion = 3\nprint(f"Hello {name} {version}!")',
    hints: [
      '確認 f-string 的開頭字母 f 緊貼著雙引號：f"Hello ..."',
      '注意驚嘆號與單一空格位置：Hello {name} {version}!',
    ],
    testMode: 'stdout',
    testCases: [
      {
        id: 'tc-101-1',
        label: '標準輸出比對',
        expectedOutput: 'Hello Python 3!',
      },
    ],
  },
  {
    id: 'py-102',
    chapterId: 'basics',
    orderLabel: '1.2',
    title: '標準輸入 input() 與數值運算',
    difficulty: '入門',
    estimatedMinutes: 10,
    summary: '將文字輸入轉為整數 int()，完成加法、除法與小數格式化。',
    visualizer: 'variables',
    concepts: [
      {
        heading: 'input() 預設回傳字串',
        body: '每次呼叫 input() 讀取到的都是文字 str，必須透過 int() 或 float() 轉型後才能進行數學加減。',
        exampleCode: 'raw = "42"\nnum = int(raw)\nprint(num + 8)',
      },
      {
        heading: '控制小數位數 :.1f',
        body: '在 f-string 的大括號內加上 :.1f，可將浮點數精準四捨五入顯示到小數點後第 1 位。',
        exampleCode: 'avg = (10 + 5) / 2\nprint(f"平均：{avg:.1f}")',
      },
    ],
    exerciseTitle: '兩數總和與平均計算器',
    exercisePrompt:
      '透過兩次 input() 依序讀取兩個整數 a 與 b，計算它們的總和與平均，並依格式印出：\nsum=總和, avg=平均（平均固定顯示到小數點後一位）',
    starterCode: 'a = int(input())\nb = int(input())\n\n# 請計算 total 與 avg，並依格式印出\n',
    solutionCode:
      'a = int(input())\nb = int(input())\ntotal = a + b\navg = total / 2\nprint(f"sum={total}, avg={avg:.1f}")',
    hints: [
      '總和為 a + b，平均為 (a + b) / 2。',
      '使用 print(f"sum={total}, avg={avg:.1f}") 即可固定顯示一位小數。',
    ],
    testMode: 'stdout',
    defaultStdin: '10\n5\n',
    testCases: [
      {
        id: 'tc-102-1',
        label: '輸入 10 與 5',
        stdin: '10\n5\n',
        expectedOutput: 'sum=15, avg=7.5',
      },
      {
        id: 'tc-102-2',
        label: '輸入 8 與 12（整除顯示 .0）',
        stdin: '8\n12\n',
        expectedOutput: 'sum=20, avg=10.0',
      },
      {
        id: 'tc-102-3',
        label: '包含負數 -4 與 7',
        stdin: '-4\n7\n',
        expectedOutput: 'sum=3, avg=1.5',
      },
    ],
  },
  {
    id: 'py-103',
    chapterId: 'basics',
    orderLabel: '1.3',
    title: '字串方法與正規化處理',
    difficulty: '入門',
    estimatedMinutes: 10,
    summary: '運用 strip()、lower() 與 replace() 清洗使用者輸入的原始字串。',
    visualizer: 'string_slice',
    concepts: [
      {
        heading: '去除空白與大小寫轉換',
        body: '字串方法會回傳新的字串。常見的串接用法為 text.strip().lower()，先清除頭尾空白再轉成全小寫。',
        exampleCode: 'raw = "  PyLab Studio  "\nclean = raw.strip().lower()\nprint(clean)',
      },
      {
        heading: '字串切片 s[start:end]',
        body: '字串可透過索引存取，正向從 0 開始，反向從 -1 開始；s[0:3] 會取出索引 0、1、2 的字元。',
        exampleCode: 'word = "PYTHON"\nprint(word[0:2], word[-2:])',
      },
    ],
    exerciseTitle: '帳號名稱正規化函式',
    exercisePrompt:
      '請完成函式 format_username(raw_name)：\n1. 去除前後多餘空白\n2. 全部轉為小寫\n3. 將字串中的空白字元 " " 替換為底線 "_"\n例如："  Alice Chen  " 應回傳 "alice_chen"。',
    starterCode: 'def format_username(raw_name):\n    # 請實作字串清洗並回傳結果\n    pass\n',
    solutionCode:
      'def format_username(raw_name):\n    return raw_name.strip().lower().replace(" ", "_")\n',
    hints: [
      '可以先呼叫 raw_name.strip() 去掉前後空白，再呼叫 .lower()。',
      '接著使用 .replace(" ", "_") 把中間空白替換成底線並 return。',
    ],
    testMode: 'function',
    testCases: [
      {
        id: 'tc-103-1',
        label: '標準含前後空白名字',
        functionName: 'format_username',
        args: ['  Alice Chen  '],
        expectedValue: 'alice_chen',
      },
      {
        id: 'tc-103-2',
        label: '全大寫雙空白',
        functionName: 'format_username',
        args: ['BOB LIN'],
        expectedValue: 'bob_lin',
      },
      {
        id: 'tc-103-3',
        label: '單一單字無空白',
        functionName: 'format_username',
        args: ['  Pythonista '],
        expectedValue: 'pythonista',
      },
    ],
  },
  {
    id: 'py-201',
    chapterId: 'control-flow',
    orderLabel: '2.1',
    title: 'if / elif / else 條件分支',
    difficulty: '入門',
    estimatedMinutes: 10,
    summary: '理解由上而下的條件評估順序，避免條件區間重疊導致的邏輯錯誤。',
    visualizer: 'branch_flow',
    concepts: [
      {
        heading: '縮排即程式區塊',
        body: 'Python 使用 4 個空白作為縮排來定義程式區塊，if、elif 與 else 行尾皆須加上冒號 :。',
        exampleCode: 'temp = 28\nif temp >= 30:\n    print("炎熱")\nelif temp >= 20:\n    print("舒適")\nelse:\n    print("微涼")',
      },
    ],
    exerciseTitle: '成績等第分類器',
    exercisePrompt:
      '請完成函式 grade_score(score)，依分數回傳對應等第字串：\n• 90 以上（含）："A"\n• 80 ~ 89："B"\n• 70 ~ 79："C"\n• 60 ~ 69："D"\n• 低於 60："F"',
    starterCode: 'def grade_score(score):\n    # 請撰寫條件分支判斷\n    pass\n',
    solutionCode:
      'def grade_score(score):\n    if score >= 90:\n        return "A"\n    elif score >= 80:\n        return "B"\n    elif score >= 70:\n        return "C"\n    elif score >= 60:\n        return "D"\n    else:\n        return "F"\n',
    hints: [
      '從最高分 >= 90 開始由高到低判斷，能讓條件寫法最精簡。',
      '記得每個分支都要使用 return 回傳字串（而非只有 print）。',
    ],
    testMode: 'function',
    testCases: [
      { id: 'tc-201-1', label: '滿分 100', functionName: 'grade_score', args: [100], expectedValue: 'A' },
      { id: 'tc-201-2', label: '邊界值 90', functionName: 'grade_score', args: [90], expectedValue: 'A' },
      { id: 'tc-201-3', label: '邊界值 80', functionName: 'grade_score', args: [80], expectedValue: 'B' },
      { id: 'tc-201-4', label: '75 分', functionName: 'grade_score', args: [75], expectedValue: 'C' },
      { id: 'tc-201-5', label: '60 分及格邊界', functionName: 'grade_score', args: [60], expectedValue: 'D' },
      { id: 'tc-201-6', label: '59 分不及格', functionName: 'grade_score', args: [59], expectedValue: 'F' },
    ],
  },
  {
    id: 'py-202',
    chapterId: 'control-flow',
    orderLabel: '2.2',
    title: '複合邏輯與閏年規則',
    difficulty: '進階',
    estimatedMinutes: 12,
    summary: '活用 and、or、not 組合多個布林條件，解決格里曆閏年判定問題。',
    visualizer: 'branch_flow',
    concepts: [
      {
        heading: '邏輯運算優先順序',
        body: '運算優先序為 not > and > or。當條件較複雜時，強烈建議加上括號 () 明確表達分組意圖。',
        exampleCode: 'age = 22\nhas_id = True\nif age >= 18 and has_id:\n    print("允許入場")',
      },
    ],
    exerciseTitle: '西元閏年判斷函式',
    exercisePrompt:
      '請完成函式 is_leap_year(year)，回傳布林值 True 或 False。\n閏年規則：\n• 年份能被 400 整除（是閏年）\n• 或者：年份能被 4 整除「且」不能被 100 整除（是閏年）\n• 其餘皆為平年 (False)。',
    starterCode: 'def is_leap_year(year):\n    # 請回傳 True 或 False\n    pass\n',
    solutionCode:
      'def is_leap_year(year):\n    return (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0)\n',
    hints: [
      '整除可用餘數運算子 % 檢查：year % 4 == 0。',
      '可以直接回傳運算式：(year % 4 == 0 and year % 100 != 0) or (year % 400 == 0)。',
    ],
    testMode: 'function',
    testCases: [
      { id: 'tc-202-1', label: '2024 一般閏年', functionName: 'is_leap_year', args: [2024], expectedValue: true },
      { id: 'tc-202-2', label: '1900 百年非閏年', functionName: 'is_leap_year', args: [1900], expectedValue: false },
      { id: 'tc-202-3', label: '2000 四百年閏年', functionName: 'is_leap_year', args: [2000], expectedValue: true },
      { id: 'tc-202-4', label: '2023 平年', functionName: 'is_leap_year', args: [2023], expectedValue: false },
    ],
  },
  {
    id: 'py-203',
    chapterId: 'control-flow',
    orderLabel: '2.3',
    title: '巢狀條件與多條件票價計算',
    difficulty: '進階',
    estimatedMinutes: 12,
    summary: '在主條件內部嵌套次條件，精確處理年齡與身分的組合邏輯。',
    concepts: [
      {
        heading: '提早回傳 (Early Return) 寫法',
        body: '在函式中先處理特殊邊界（如兒童或長者），再處理一般情況，能減少深層縮排，讓程式碼更易讀。',
        exampleCode: 'def shipping_fee(total, vip):\n    if vip:\n        return 0\n    return 0 if total >= 1000 else 80\nprint(shipping_fee(500, False))',
      },
    ],
    exerciseTitle: '電影院分級票價計算',
    exercisePrompt:
      '請完成函式 ticket_price(age, is_student)，回傳票價整數：\n• 未滿 12 歲（age < 12）：免費 0 元\n• 65 歲以上（age >= 65）：敬老票 150 元\n• 其餘年齡（12 ~ 64 歲）：若 is_student 為 True 回傳 200 元，否則全票 300 元',
    starterCode: 'def ticket_price(age, is_student):\n    # 請依年齡與學生身分計算票價\n    pass\n',
    solutionCode:
      'def ticket_price(age, is_student):\n    if age < 12:\n        return 0\n    if age >= 65:\n        return 150\n    if is_student:\n        return 200\n    return 300\n',
    hints: [
      '先檢查 age < 12 與 age >= 65 的情況並直接 return。',
      '剩下的範圍一定是 12 到 64 歲之間，只需判斷 is_student 是否為 True。',
    ],
    testMode: 'function',
    testCases: [
      { id: 'tc-203-1', label: '兒童票 (10歲)', functionName: 'ticket_price', args: [10, false], expectedValue: 0 },
      { id: 'tc-203-2', label: '學生票 (20歲學生)', functionName: 'ticket_price', args: [20, true], expectedValue: 200 },
      { id: 'tc-203-3', label: '一般全票 (30歲非學生)', functionName: 'ticket_price', args: [30, false], expectedValue: 300 },
      { id: 'tc-203-4', label: '敬老票 (70歲)', functionName: 'ticket_price', args: [70, false], expectedValue: 150 },
      { id: 'tc-203-5', label: '12歲非學生邊界', functionName: 'ticket_price', args: [12, false], expectedValue: 300 },
    ],
  },
  {
    id: 'py-301',
    chapterId: 'loops',
    orderLabel: '3.1',
    title: 'for 迴圈與 range() 步進累加',
    difficulty: '入門',
    estimatedMinutes: 10,
    summary: '掌握 range(start, stop, step) 的半開區間特性，寫出簡潔的迴圈運算。',
    visualizer: 'loop_trace',
    concepts: [
      {
        heading: 'range() 的起點、終點與步長',
        body: 'range(1, n + 1) 會產生 1 到 n 的整數序列（包含起點、不包含終點）。第三個參數 step 可指定每次跳躍的間隔。',
        exampleCode: 'total = 0\nfor i in range(1, 6):\n    total += i\nprint("1~5 總和:", total)',
      },
    ],
    exerciseTitle: '範圍內偶數總和',
    exercisePrompt:
      '請完成函式 sum_even(n)，計算並回傳從 1 到 n（包含 n）之間所有「偶數」的總和。\n若 n 小於 2，應回傳 0。',
    starterCode: 'def sum_even(n):\n    total = 0\n    # 使用 for 迴圈累加偶數\n    return total\n',
    solutionCode:
      'def sum_even(n):\n    total = 0\n    for i in range(2, n + 1, 2):\n        total += i\n    return total\n',
    hints: [
      '可以使用 range(2, n + 1, 2) 直接每次跳 2 個數字，或用 if i % 2 == 0 過濾。',
      '注意 range 的第二個參數要寫 n + 1 才會包含 n 本身！',
    ],
    testMode: 'function',
    testCases: [
      { id: 'tc-301-1', label: 'n = 10 (2+4+6+8+10)', functionName: 'sum_even', args: [10], expectedValue: 30 },
      { id: 'tc-301-2', label: 'n = 7 (2+4+6)', functionName: 'sum_even', args: [7], expectedValue: 12 },
      { id: 'tc-301-3', label: 'n = 1 (無偶數)', functionName: 'sum_even', args: [1], expectedValue: 0 },
      { id: 'tc-301-4', label: 'n = 2', functionName: 'sum_even', args: [2], expectedValue: 2 },
    ],
  },
  {
    id: 'py-302',
    chapterId: 'loops',
    orderLabel: '3.2',
    title: 'while 迴圈與數位拆解',
    difficulty: '進階',
    estimatedMinutes: 12,
    summary: '當重複次數取決於條件而非固定區間時，使用 while 搭配 // 與 % 逐步處理數值。',
    visualizer: 'loop_trace',
    concepts: [
      {
        heading: '整數除法 // 與取餘數 %',
        body: 'num % 10 可以取得個位數；num //= 10 則能把最右邊的個位數移除。反覆執行直到 num == 0 為止。',
        exampleCode: 'n = 482\nwhile n > 0:\n    print("取出個位:", n % 10)\n    n //= 10',
      },
    ],
    exerciseTitle: '計算整數各位數字總和',
    exercisePrompt:
      '請完成函式 digit_sum(num)，計算非負整數 num 每一位數字的總和並回傳。\n例如：digit_sum(1234) 應回傳 1 + 2 + 3 + 4 = 10；digit_sum(0) 應回傳 0。',
    starterCode: 'def digit_sum(num):\n    # 請使用 while 迴圈拆解各位數字\n    pass\n',
    solutionCode:
      'def digit_sum(num):\n    total = 0\n    while num > 0:\n        total += num % 10\n        num //= 10\n    return total\n',
    hints: [
      '建立變數 total = 0，當 num > 0 時進入 while 迴圈。',
      '在迴圈內執行 total += num % 10，接著 num //= 10。',
    ],
    testMode: 'function',
    testCases: [
      { id: 'tc-302-1', label: '1234 -> 10', functionName: 'digit_sum', args: [1234], expectedValue: 10 },
      { id: 'tc-302-2', label: '9051 -> 15', functionName: 'digit_sum', args: [9051], expectedValue: 15 },
      { id: 'tc-302-3', label: '0 -> 0', functionName: 'digit_sum', args: [0], expectedValue: 0 },
      { id: 'tc-302-4', label: '999 -> 27', functionName: 'digit_sum', args: [999], expectedValue: 27 },
    ],
  },
  {
    id: 'py-303',
    chapterId: 'loops',
    orderLabel: '3.3',
    title: '迴圈與星號圖形輸出',
    difficulty: '進階',
    estimatedMinutes: 10,
    summary: '結合迴圈與字串乘法 "*" * i，按規則印出逐行遞增的圖形結構。',
    concepts: [
      {
        heading: '字串重複運算子 *',
        body: '在 Python 中，"*" * 4 會直接產生 "****"，讓繪製階梯與邊框圖形變得非常簡潔。',
        exampleCode: 'for row in range(1, 4):\n    print("-" * row)',
      },
    ],
    exerciseTitle: '繪製 N 層星號直角三角形',
    exercisePrompt:
      '讀取一個正整數 n，依序印出 n 行星號：\n第 1 行印出 1 個 *，第 2 行印出 2 個 *，以此類推直到第 n 行。',
    starterCode: 'n = int(input())\n\n# 請印出 n 行星號三角形\n',
    solutionCode: 'n = int(input())\nfor i in range(1, n + 1):\n    print("*" * i)\n',
    hints: [
      '使用 for i in range(1, n + 1): 控制行數。',
      '每一行只要執行 print("*" * i) 即可。',
    ],
    testMode: 'stdout',
    defaultStdin: '4\n',
    testCases: [
      {
        id: 'tc-303-1',
        label: 'n = 4 層三角形',
        stdin: '4\n',
        expectedOutput: '*\n**\n***\n****',
      },
      {
        id: 'tc-303-2',
        label: 'n = 1 單層',
        stdin: '1\n',
        expectedOutput: '*',
      },
    ],
  },
  {
    id: 'py-401',
    chapterId: 'collections',
    orderLabel: '4.1',
    title: '串列 list 操作與去重排序',
    difficulty: '入門',
    estimatedMinutes: 12,
    summary: '學習串列索引、負索引、sorted() 排序以及利用 set() 去除重複元素。',
    visualizer: 'list_index',
    concepts: [
      {
        heading: '負索引與 sorted() 排序',
        body: 'nums[-1] 代表最後一個元素，nums[-2] 代表倒數第二個。sorted(nums) 會回傳一個全新的排序串列，不會修改原串列。',
        exampleCode: 'scores = [85, 92, 78, 92]\nunique_sorted = sorted(set(scores))\nprint("排序去重:", unique_sorted)\nprint("最高分:", unique_sorted[-1])',
      },
    ],
    exerciseTitle: '找出第二大的數值',
    exercisePrompt:
      '請完成函式 second_largest(nums)。輸入的串列 nums 保證至少有兩個「不同」的整數（可能包含重複數字，例如 [5, 8, 8, 3]）。\n請回傳第二大的數值（此例應回傳 5）。',
    starterCode: 'def second_largest(nums):\n    # 提示：先去除重複並排序，再取倒數第二個\n    pass\n',
    solutionCode: 'def second_largest(nums):\n    unique_nums = sorted(set(nums))\n    return unique_nums[-2]\n',
    hints: [
      '先用 set(nums) 去除重複的數字，這樣即使最大值出現多次也不會干擾結果。',
      '再用 sorted(...) 由小到大排序後，回傳索引 [-2] 即可。',
    ],
    testMode: 'function',
    testCases: [
      { id: 'tc-401-1', label: '含重複最大值 [5, 8, 8, 3]', functionName: 'second_largest', args: [[5, 8, 8, 3]], expectedValue: 5 },
      { id: 'tc-401-2', label: '負數串列 [-10, -3, -7]', functionName: 'second_largest', args: [[-10, -3, -7]], expectedValue: -7 },
      { id: 'tc-401-3', label: '兩個元素 [42, 19]', functionName: 'second_largest', args: [[42, 19]], expectedValue: 19 },
    ],
  },
  {
    id: 'py-402',
    chapterId: 'collections',
    orderLabel: '4.2',
    title: '串列推導式 List Comprehension',
    difficulty: '進階',
    estimatedMinutes: 12,
    summary: '用一行表達力極佳的 Pythonic 語法同時完成資料過濾與轉換。',
    visualizer: 'list_index',
    concepts: [
      {
        heading: '推導式基本語法',
        body: '[轉換式 for 變數 in 序列 if 條件] 可取代繁瑣的空串列 + append 迴圈，執行效率也更好。',
        exampleCode: 'nums = [1, 2, 3, 4, 5, 6]\nevens_doubled = [x * 2 for x in nums if x % 2 == 0]\nprint(evens_doubled)',
      },
    ],
    exerciseTitle: '篩選奇數並計算平方',
    exercisePrompt:
      '請完成函式 square_odds(nums)，挑出串列 nums 中的所有「奇數」（維持原本順序），並將每個奇數平方後組成新串列回傳。\n例如：[1, 2, 3, 4, 5] 應回傳 [1, 9, 25]。',
    starterCode: 'def square_odds(nums):\n    # 請使用串列推導式實作\n    pass\n',
    solutionCode: 'def square_odds(nums):\n    return [x ** 2 for x in nums if x % 2 != 0]\n',
    hints: [
      '判斷奇數的條件為 x % 2 != 0（即使為負奇數也適用！）。',
      '結合起來：[x ** 2 for x in nums if x % 2 != 0]。',
    ],
    testMode: 'function',
    testCases: [
      { id: 'tc-402-1', label: '一般正整數 [1, 2, 3, 4, 5]', functionName: 'square_odds', args: [[1, 2, 3, 4, 5]], expectedValue: [1, 9, 25] },
      { id: 'tc-402-2', label: '全是偶數 [2, 4, 8]', functionName: 'square_odds', args: [[2, 4, 8]], expectedValue: [] },
      { id: 'tc-402-3', label: '含負奇數 [-3, 0, 7]', functionName: 'square_odds', args: [[-3, 0, 7]], expectedValue: [9, 49] },
    ],
  },
  {
    id: 'py-403',
    chapterId: 'collections',
    orderLabel: '4.3',
    title: '字典 dict 計數與鍵值查詢',
    difficulty: '進階',
    estimatedMinutes: 14,
    summary: '學會用 dict.get(key, 0) 安全累加次數，建構高效的統計查詢表。',
    visualizer: 'dict_map',
    concepts: [
      {
        heading: '使用 .get() 避免 KeyError',
        body: '若直接存取不存在的鍵 counts[ch] 會觸發 KeyError；改用 counts.get(ch, 0) 可以在鍵不存在時回傳預設值 0。',
        exampleCode: 'words = ["apple", "banana", "apple"]\ncounts = {}\nfor w in words:\n    counts[w] = counts.get(w, 0) + 1\nprint(counts)',
      },
    ],
    exerciseTitle: '字元出現次數統計表',
    exercisePrompt:
      '請完成函式 char_frequency(text)：統計字串 text 中每個字元出現的次數，並以字典回傳。\n注意：請忽略空白字元 " "（不要將空白算入統計結果）。\n例如："a b a" 應回傳 {"a": 2, "b": 1}。',
    starterCode: 'def char_frequency(text):\n    freq = {}\n    # 走訪字串並跳過空白字元\n    return freq\n',
    solutionCode:
      'def char_frequency(text):\n    freq = {}\n    for ch in text:\n        if ch == " ":\n            continue\n        freq[ch] = freq.get(ch, 0) + 1\n    return freq\n',
    hints: [
      '用 for ch in text: 逐一檢查字元，若 ch == " " 就用 continue 跳過。',
      '統計累加可用 freq[ch] = freq.get(ch, 0) + 1。',
    ],
    testMode: 'function',
    testCases: [
      { id: 'tc-403-1', label: '含空白字串 "a b a"', functionName: 'char_frequency', args: ['a b a'], expectedValue: { a: 2, b: 1 } },
      { id: 'tc-403-2', label: '單字 "hello"', functionName: 'char_frequency', args: ['hello'], expectedValue: { h: 1, e: 1, l: 2, o: 1 } },
      { id: 'tc-403-3', label: '空字串與純空白', functionName: 'char_frequency', args: ['   '], expectedValue: {} },
    ],
  },
  {
    id: 'py-501',
    chapterId: 'functions',
    orderLabel: '5.1',
    title: '函式預設參數與多值回傳',
    difficulty: '入門',
    estimatedMinutes: 10,
    summary: '設計具備彈性的函式介面，提供合理預設值並同時回傳多個計算結果。',
    concepts: [
      {
        heading: '預設參數位置規則',
        body: '擁有預設值的參數必須寫在沒有預設值的參數之後，呼叫端可選擇省略或覆寫該參數。',
        exampleCode: 'def greet(name, prefix="你好"):\n    return f"{prefix}, {name}"\nprint(greet("小華"))\nprint(greet("小華", "早安"))',
      },
    ],
    exerciseTitle: '矩形面積與周長計算',
    exercisePrompt:
      '請完成函式 calc_rect(width, height=10)，其中 height 預設值為 10。\n函式需回傳一個包含兩個元素的串列：[面積, 周長]。\n例如：calc_rect(5) 回傳 [50, 30]；calc_rect(4, 6) 回傳 [24, 20]。',
    starterCode: 'def calc_rect(width, height=10):\n    # 請回傳 [area, perimeter]\n    pass\n',
    solutionCode:
      'def calc_rect(width, height=10):\n    area = width * height\n    perimeter = 2 * (width + height)\n    return [area, perimeter]\n',
    hints: [
      '面積為 width * height，周長為 2 * (width + height)。',
      '確保參數列寫成 def calc_rect(width, height=10): 並回傳串列 [area, perimeter]。',
    ],
    testMode: 'function',
    testCases: [
      { id: 'tc-501-1', label: '使用預設高 calc_rect(5)', functionName: 'calc_rect', args: [5], expectedValue: [50, 30] },
      { id: 'tc-501-2', label: '指定長寬 calc_rect(4, 6)', functionName: 'calc_rect', args: [4, 6], expectedValue: [24, 20] },
      { id: 'tc-501-3', label: '正方形 calc_rect(7, 7)', functionName: 'calc_rect', args: [7, 7], expectedValue: [49, 28] },
    ],
  },
  {
    id: 'py-502',
    chapterId: 'functions',
    orderLabel: '5.2',
    title: '費氏數列：疊代與遞迴比較',
    difficulty: '進階',
    estimatedMinutes: 14,
    summary: '理解 Base Case 與狀態轉移，實作高效率的第 N 項費氏數列計算。',
    concepts: [
      {
        heading: '雙變數同步更新',
        body: 'Python 支援優雅的同步賦值語法 a, b = b, a + b，能用 O(N) 時間且無須額外暫存變數算出費氏數列。',
        exampleCode: 'a, b = 0, 1\nfor _ in range(6):\n    print(a, end=" ")\n    a, b = b, a + b',
      },
    ],
    exerciseTitle: '第 N 項費氏數',
    exercisePrompt:
      '請完成函式 fibonacci(n)，回傳第 n 項費氏數：\n• fibonacci(0) -> 0\n• fibonacci(1) -> 1\n• fibonacci(n) -> fibonacci(n-1) + fibonacci(n-2)\n注意：測試包含 n=30，建議使用迴圈實作以確保執行速度。',
    starterCode: 'def fibonacci(n):\n    # 請實作第 n 項費氏數列\n    pass\n',
    solutionCode:
      'def fibonacci(n):\n    if n <= 1:\n        return n\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a\n',
    hints: [
      '當 n == 0 時回傳 0，n == 1 時回傳 1。',
      '使用 a, b = 0, 1 並重複執行 n 次 a, b = b, a + b，最後回傳 a 即可。',
    ],
    testMode: 'function',
    testCases: [
      { id: 'tc-502-1', label: 'n = 0', functionName: 'fibonacci', args: [0], expectedValue: 0 },
      { id: 'tc-502-2', label: 'n = 1', functionName: 'fibonacci', args: [1], expectedValue: 1 },
      { id: 'tc-502-3', label: 'n = 6', functionName: 'fibonacci', args: [6], expectedValue: 8 },
      { id: 'tc-502-4', label: 'n = 12', functionName: 'fibonacci', args: [12], expectedValue: 144 },
      { id: 'tc-502-5', label: '效能測試 n = 30', functionName: 'fibonacci', args: [30], expectedValue: 832040 },
    ],
  },
  {
    id: 'py-601',
    chapterId: 'challenges',
    orderLabel: '6.1',
    title: '質數判斷與篩選器',
    difficulty: '挑戰',
    estimatedMinutes: 15,
    summary: '運用平方根檢查優化或埃拉托斯特尼篩法，快速找出區間內的所有質數。',
    concepts: [
      {
        heading: '質數檢查只需測試到 √n',
        body: '若 n 有大於 √n 的因數，必定有另一個小於 √n 的配對因數。因此迴圈檢查範圍只需到 int(n ** 0.5) + 1。',
        exampleCode: 'def is_prime(num):\n    if num < 2:\n        return False\n    for d in range(2, int(num ** 0.5) + 1):\n        if num % d == 0:\n            return False\n    return True\nprint([x for x in range(20) if is_prime(x)])',
      },
    ],
    exerciseTitle: '小於等於 Limit 的所有質數',
    exercisePrompt:
      '請完成函式 get_primes(limit)，回傳所有小於等於 limit 的質數所組成的遞增串列。\n若 limit < 2，請回傳空串列 []。',
    starterCode: 'def get_primes(limit):\n    # 請找出 <= limit 的所有質數\n    pass\n',
    solutionCode:
      'def get_primes(limit):\n    primes = []\n    for num in range(2, limit + 1):\n        is_p = True\n        for d in range(2, int(num ** 0.5) + 1):\n            if num % d == 0:\n                is_p = False\n                break\n        if is_p:\n            primes.append(num)\n    return primes\n',
    hints: [
      '可以先寫一個內部輔助判斷，檢查 2 到 limit 的每個整數是否能被 2 ~ int(num ** 0.5) 整除。',
      '一旦找到因數就立刻 break 跳出內層迴圈，能大幅提升效能。',
    ],
    testMode: 'function',
    testCases: [
      { id: 'tc-601-1', label: 'limit = 10', functionName: 'get_primes', args: [10], expectedValue: [2, 3, 5, 7] },
      { id: 'tc-601-2', label: 'limit = 2', functionName: 'get_primes', args: [2], expectedValue: [2] },
      { id: 'tc-601-3', label: 'limit = 1 (無質數)', functionName: 'get_primes', args: [1], expectedValue: [] },
      { id: 'tc-601-4', label: 'limit = 30', functionName: 'get_primes', args: [30], expectedValue: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29] },
    ],
  },
  {
    id: 'py-602',
    chapterId: 'challenges',
    orderLabel: '6.2',
    title: '購物車結帳系統',
    difficulty: '挑戰',
    estimatedMinutes: 15,
    summary: '走訪字典組成的串列資料結構，完成商品金額加總、折扣計算與整數四捨五入。',
    concepts: [
      {
        heading: '解析巢狀資料結構',
        body: '實務資料常以「串列包字典」的形式出現（類似 JSON 陣列）。可用 item["price"] * item["qty"] 取得單品小計。',
        exampleCode: 'cart = [{"name": "筆電", "price": 30000, "qty": 1}, {"name": "滑鼠", "price": 800, "qty": 2}]\nprint(sum(i["price"] * i["qty"] for i in cart))',
      },
    ],
    exerciseTitle: '計算結帳總金額',
    exercisePrompt:
      '請完成函式 checkout(items, coupon=0)：\n• items 是字典串列，每筆包含 "name"、"price"（單價）與 "qty"（數量）\n• coupon 為折扣折讓比例（例如 0.2 表示折抵 20%，即打 8 折），預設為 0\n請計算總價並套用折扣後，使用 round() 四捨五入為整數回傳。',
    starterCode: 'def checkout(items, coupon=0):\n    # 請計算折扣後總金額並四捨五入\n    pass\n',
    solutionCode:
      'def checkout(items, coupon=0):\n    subtotal = sum(item["price"] * item["qty"] for item in items)\n    return round(subtotal * (1 - coupon))\n',
    hints: [
      '先累計每項商品的 item["price"] * item["qty"] 得出 subtotal。',
      '折扣後金額為 subtotal * (1 - coupon)，再用 round(...) 包起來回傳。',
    ],
    testMode: 'function',
    testCases: [
      {
        id: 'tc-602-1',
        label: '無折扣預設結帳',
        functionName: 'checkout',
        args: [[{ name: 'Book', price: 320, qty: 2 }, { name: 'Pen', price: 45, qty: 3 }]],
        expectedValue: 775,
      },
      {
        id: 'tc-602-2',
        label: '套用 8 折優惠券 (coupon=0.2)',
        functionName: 'checkout',
        args: [[{ name: 'Keyboard', price: 1250, qty: 1 }, { name: 'Pad', price: 300, qty: 2 }], 0.2],
        expectedValue: 1480,
      },
      {
        id: 'tc-602-3',
        label: '空購物車',
        functionName: 'checkout',
        args: [[], 0.1],
        expectedValue: 0,
      },
    ],
  },
  {
    id: 'py-603',
    chapterId: 'challenges',
    orderLabel: '6.3',
    title: '迴文句子檢查器',
    difficulty: '挑戰',
    estimatedMinutes: 15,
    summary: '結合字元過濾 .isalnum()、大小寫正規化與切片反轉 [::-1] 完成文本檢驗。',
    concepts: [
      {
        heading: '切片反轉字串 [::-1]',
        body: '省略起點與終點並將步長設為 -1（即 s[::-1]），可以瞬間建立反轉後的新字串。搭配 ch.isalnum() 過濾標點符號與空白。',
        exampleCode: 'text = "Race car!"\ncleaned = "".join(c.lower() for c in text if c.isalnum())\nprint(cleaned, cleaned == cleaned[::-1])',
      },
    ],
    exerciseTitle: '忽略標點與大小寫的迴文判斷',
    exercisePrompt:
      '請完成函式 is_palindrome(s)：只保留字串中的英文字母與數字（可使用 c.isalnum()），並忽略大小寫差異，判斷正反讀起來是否完全相同。\n例如："A man, a plan, a canal: Panama" 應回傳 True。',
    starterCode: 'def is_palindrome(s):\n    # 請過濾非英數字元並比較正反字串\n    pass\n',
    solutionCode:
      'def is_palindrome(s):\n    cleaned = "".join(c.lower() for c in s if c.isalnum())\n    return cleaned == cleaned[::-1]\n',
    hints: [
      '用 "".join(c.lower() for c in s if c.isalnum()) 產生只含小寫英數字的字串。',
      '回傳 cleaned == cleaned[::-1] 即可。',
    ],
    testMode: 'function',
    testCases: [
      {
        id: 'tc-603-1',
        label: '經典英文迴文含標點',
        functionName: 'is_palindrome',
        args: ['A man, a plan, a canal: Panama'],
        expectedValue: true,
      },
      {
        id: 'tc-603-2',
        label: '非迴文句子',
        functionName: 'is_palindrome',
        args: ['Python Programming'],
        expectedValue: false,
      },
      {
        id: 'tc-603-3',
        label: '含數字與空白',
        functionName: 'is_palindrome',
        args: ['123 21'],
        expectedValue: true,
      },
    ],
  },
];

export const SANDBOX_TEMPLATES: SandboxTemplate[] = [
  {
    id: 'tpl-hello',
    title: '基本輸入與 f-string',
    category: '基礎語法',
    description: '示範從標準輸入讀取文字與數值並格式化輸出。',
    stdin: '小明\n21\n',
    code: 'name = input("請輸入名字: ")\nage = int(input("請輸入年齡: "))\nprint(f"你好 {name}，明年你將滿 {age + 1} 歲！")',
  },
  {
    id: 'tpl-mult-table',
    title: '九九乘法表產生器',
    category: '迴圈結構',
    description: '使用巢狀 for 迴圈對齊排版印出完整乘法表。',
    code: 'for i in range(1, 10):\n    row = " ".join(f"{j}x{i}={i*j:2d}" for j in range(1, 10))\n    print(row)',
  },
  {
    id: 'tpl-word-freq',
    title: '文本詞頻統計分析',
    category: '字典應用',
    description: '統計段落中各單字出現次數並依頻率由高到低排序。',
    code: 'article = "python is simple python is powerful and python is fun"\nwords = article.split()\n\ncounts = {}\nfor w in words:\n    counts[w] = counts.get(w, 0) + 1\n\nfor word, freq in sorted(counts.items(), key=lambda x: -x[1]):\n    print(f"{word:<10} : {\'#\' * freq} ({freq})")',
  },
  {
    id: 'tpl-sieve',
    title: '埃拉托斯特尼質數篩',
    category: '演算法',
    description: '高效率找出 100 以內的所有質數。',
    code: 'def sieve(n):\n    is_prime = [True] * (n + 1)\n    is_prime[0] = is_prime[1] = False\n    for p in range(2, int(n ** 0.5) + 1):\n        if is_prime[p]:\n            for multiple in range(p * p, n + 1, p):\n                is_prime[multiple] = False\n    return [i for i, ok in enumerate(is_prime) if ok]\n\nprimes = sieve(100)\nprint(f"100 以內共有 {len(primes)} 個質數：")\nprint(primes)',
  },
  {
    id: 'tpl-quicksort',
    title: '快速排序 QuickSort',
    category: '遞迴實作',
    description: '以串列推導式寫出極具 Python 風格的遞迴排序法。',
    code: 'def quicksort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quicksort(left) + middle + quicksort(right)\n\ndata = [34, 7, 23, 32, 5, 62, 19]\nprint("原始:", data)\nprint("排序:", quicksort(data))',
  },
];

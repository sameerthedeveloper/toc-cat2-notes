const Q = (m, q, a) => ({ m, q, a });

const BUYS_TABLE = `<table><tr><th>#</th><th>age</th><th>income</th><th>student</th><th>credit_rating</th><th>buys_computer</th></tr>
<tr><td>1</td><td>youth</td><td>high</td><td>no</td><td>fair</td><td>no</td></tr><tr><td>2</td><td>youth</td><td>high</td><td>no</td><td>excellent</td><td>no</td></tr>
<tr><td>3</td><td>middle</td><td>high</td><td>no</td><td>fair</td><td>yes</td></tr><tr><td>4</td><td>senior</td><td>medium</td><td>no</td><td>fair</td><td>yes</td></tr>
<tr><td>5</td><td>senior</td><td>low</td><td>yes</td><td>fair</td><td>yes</td></tr><tr><td>6</td><td>senior</td><td>low</td><td>yes</td><td>excellent</td><td>no</td></tr>
<tr><td>7</td><td>middle</td><td>low</td><td>yes</td><td>excellent</td><td>yes</td></tr><tr><td>8</td><td>youth</td><td>medium</td><td>no</td><td>fair</td><td>no</td></tr>
<tr><td>9</td><td>youth</td><td>low</td><td>yes</td><td>fair</td><td>yes</td></tr><tr><td>10</td><td>senior</td><td>medium</td><td>yes</td><td>fair</td><td>yes</td></tr>
<tr><td>11</td><td>youth</td><td>medium</td><td>yes</td><td>excellent</td><td>yes</td></tr><tr><td>12</td><td>middle</td><td>medium</td><td>no</td><td>excellent</td><td>yes</td></tr>
<tr><td>13</td><td>middle</td><td>high</td><td>yes</td><td>fair</td><td>yes</td></tr><tr><td>14</td><td>senior</td><td>medium</td><td>no</td><td>excellent</td><td>no</td></tr></table>`;

export const T3 = [
  {
    id: 'm3-1', mod: 'm3', title: 'Classification and prediction', pr: 'High',
    tags: 'classification prediction supervised learning training test model class label numeric regression two step',
    body: `
<div class="def"><b>Classification</b> builds a model that assigns a <b>categorical class label</b> to data (loan is safe or risky, mail is spam or not). <b>Prediction</b> builds a model that estimates a <b>continuous numeric value</b> (the salary of a graduate, tomorrow's temperature), usually by regression.</div>
<h2>Two-step process</h2>
<ol><li><b>Model construction (learning).</b> Each tuple in the <b>training set</b> already has a class label (supervised learning). A learning algorithm builds a classifier: decision rules, a decision tree or a mathematical formula.</li><li><b>Model usage (classification).</b> First <b>estimate accuracy</b> on a separate <b>test set</b> (the fraction of test tuples labelled correctly). If it is acceptable, use the model to label new tuples whose class is unknown.</li></ol>
<div data-w="diag:kdd"></div>
<h2>Supervised versus unsupervised</h2>
<table><tr><th></th><th>Supervised (classification)</th><th>Unsupervised (clustering)</th></tr>
<tr><td>Class labels</td><td>Known for training data</td><td>Not known</td></tr>
<tr><td>Goal</td><td>Learn rules to predict the class of new data</td><td>Discover groups in the data</td></tr>
<tr><td>Example</td><td>Credit approval</td><td>Customer segmentation</td></tr></table>
<h2>Classification versus prediction</h2>
<table><tr><th></th><th>Classification</th><th>Numeric prediction</th></tr>
<tr><td>Output</td><td>Discrete class label</td><td>Continuous value</td></tr>
<tr><td>Methods</td><td>Decision tree, Bayes, SVM, rules, kNN</td><td>Linear and non-linear regression, neural networks</td></tr>
<tr><td>Accuracy measure</td><td>Accuracy, error rate, precision, recall</td><td>MAE, MSE, RMSE</td></tr></table>
<h2>Applications</h2>
<p>Credit approval, target marketing, medical diagnosis, fraud detection, spam filtering, handwriting recognition.</p>
<div class="tip"><b>Exam tip.</b> Draw the two-step figure (training data → learning algorithm → model, test data → accuracy → classify new data). It carries most of the marks of a "classification process" question.</div>`,
    qa: [
      Q(2, 'Define classification.', 'Classification is the process of finding a model that describes data classes so the model can predict the categorical class label of tuples whose label is unknown.'),
      Q(2, 'Differentiate classification and prediction.', 'Classification predicts a discrete class label; prediction (numeric prediction or regression) predicts a continuous value.'),
      Q(5, 'Explain the two-step process of classification.', 'Learning step (training tuples with labels build the model), classification step (test set estimates accuracy, then the model labels new data). Draw the figure and give one example such as loan approval.'),
      Q(8, 'Compare supervised and unsupervised learning with examples.', '<p>Definition of each (2). Table of differences (4). Examples: classification of loan applicants versus clustering customers (2).</p>'),
    ],
  },
  {
    id: 'm3-2', mod: 'm3', title: 'Issues in classification', pr: 'Important',
    tags: 'issues classification data preparation cleaning relevance analysis transformation accuracy speed robustness scalability interpretability overfitting',
    body: `
<h2>1. Preparing the data for classification</h2>
<ul><li><b>Data cleaning:</b> remove or reduce noise, treat missing values (replace by the most common value or a predicted value).</li><li><b>Relevance analysis (feature selection):</b> remove irrelevant or redundant attributes, so learning is faster and more accurate. Correlation analysis and attribute subset selection are used.</li><li><b>Data transformation:</b> generalise attributes to higher concept levels (street to city), and <b>normalise</b> numeric values into a small range such as 0 to 1, which matters for distance-based methods and neural networks.</li></ul>
<h2>2. Comparing classification methods</h2>
<table><tr><th>Criterion</th><th>Meaning</th></tr>
<tr><td>Accuracy</td><td>Ability to predict the class of new data correctly</td></tr>
<tr><td>Speed</td><td>Time to build the model and time to use it</td></tr>
<tr><td>Robustness</td><td>Handles noise and missing values</td></tr>
<tr><td>Scalability</td><td>Works efficiently on large disk-resident data</td></tr>
<tr><td>Interpretability</td><td>How easily humans understand the model (trees and rules are good, neural networks are poor)</td></tr></table>
<h2>3. Common problems</h2>
<ul><li><b>Overfitting:</b> the model fits noise in the training data and does badly on new data. Remedies: pruning, more data, simpler model, cross-validation.</li><li><b>Underfitting:</b> model too simple to capture the pattern.</li><li><b>Class imbalance:</b> very few positive tuples (fraud). Use sampling, cost-sensitive learning, and measures like recall and F1 rather than accuracy.</li><li><b>Choosing training and test data</b> that represent the real data.</li></ul>`,
    qa: [
      Q(2, 'What is overfitting?', 'The model learns the noise and quirks of the training data, so training accuracy is high but accuracy on unseen data is low.'),
      Q(2, 'List the criteria for comparing classification methods.', 'Accuracy, speed, robustness, scalability, interpretability.'),
      Q(5, 'Explain the data preparation steps for classification.', 'Data cleaning, relevance analysis (feature selection), data transformation (generalisation and normalisation), with one line each.'),
    ],
  },
  {
    id: 'm3-3', mod: 'm3', title: 'Decision tree classification', pr: 'Very High',
    tags: 'decision tree id3 c4.5 cart information gain entropy gain ratio gini index pruning attribute selection',
    body: `
<div class="def"><b>Definition.</b> A decision tree is a flowchart-like tree: each <b>internal node</b> tests an attribute, each <b>branch</b> is an outcome of the test, and each <b>leaf</b> holds a class label. To classify a tuple, follow the path from the root to a leaf.</div>
<h2>Basic algorithm (ID3, C4.5, CART)</h2>
<ol><li>Start with all training tuples at the root.</li><li>If all tuples in the node belong to one class, make it a leaf with that class.</li><li>If no attributes remain, make it a leaf labelled with the <b>majority class</b>.</li><li>Otherwise choose the <b>best splitting attribute</b> using an attribute selection measure, create a branch for each value, and split the tuples.</li><li>Repeat recursively on each branch. Stop when a node is pure, no attributes are left, or a branch is empty.</li></ol>
<h2>Attribute selection measures</h2>
<table><tr><th>Measure</th><th>Used by</th><th>Formula</th></tr>
<tr><td><b>Information gain</b></td><td>ID3</td><td>Info(D) = −Σ p<sub>i</sub> log₂ p<sub>i</sub><br>Info<sub>A</sub>(D) = Σ (|D<sub>j</sub>|/|D|) × Info(D<sub>j</sub>)<br><b>Gain(A) = Info(D) − Info<sub>A</sub>(D)</b></td></tr>
<tr><td><b>Gain ratio</b></td><td>C4.5</td><td>SplitInfo<sub>A</sub>(D) = −Σ (|D<sub>j</sub>|/|D|) log₂(|D<sub>j</sub>|/|D|)<br><b>GainRatio(A) = Gain(A) / SplitInfo<sub>A</sub>(D)</b></td></tr>
<tr><td><b>Gini index</b></td><td>CART</td><td>Gini(D) = 1 − Σ p<sub>i</sub>²<br>Gini<sub>A</sub>(D) = Σ (|D<sub>j</sub>|/|D|) Gini(D<sub>j</sub>)<br>choose the attribute with the <b>smallest</b> Gini<sub>A</sub> (largest reduction)</td></tr></table>
<p>Information gain is biased towards attributes with many values (an ID number would give pure partitions). Gain ratio corrects this.</p>
<h2>Worked example: buys_computer</h2>
${BUYS_TABLE}
<pre>Class yes = 9, class no = 5
Info(D) = −(9/14) log₂(9/14) − (5/14) log₂(5/14) = 0.940 bits

Attribute age:  youth (2 yes, 3 no), middle (4 yes, 0 no), senior (3 yes, 2 no)
Info_age(D) = (5/14)(0.971) + (4/14)(0) + (5/14)(0.971) = 0.694
Gain(age) = 0.940 − 0.694 = 0.246

Gain(income)  = 0.029
Gain(student) = 0.151
Gain(credit_rating) = 0.048

age has the highest gain, so it is the root.
  middle → all yes → leaf "yes"
  youth  → remaining 5 tuples: split on student (no → no, yes → yes), both pure
  senior → remaining 5 tuples: split on credit_rating (fair → yes, excellent → no)</pre>
<div data-w="diag:tree"></div>
<div data-w="tree"></div>
<p><b>Rules from the tree</b> (one per leaf): IF age = youth AND student = no THEN buys = no; IF age = middle THEN buys = yes; IF age = senior AND credit = fair THEN buys = yes.</p>
<h2>Continuous attributes</h2>
<p>Sort the values, take the midpoint of each adjacent pair as a candidate split point (a + b)/2, and pick the split point with the best gain. The test is A ≤ split-point versus A &gt; split-point.</p>
<h2>Tree pruning</h2>
<p>A fully grown tree overfits noise. <b>Prepruning</b> stops growing early (gain below a threshold, too few tuples). <b>Postpruning</b> grows the full tree and removes subtrees (cost complexity pruning in CART, pessimistic pruning in C4.5), replacing a subtree by a leaf. Postpruning is more reliable.</p>
<h2>Advantages and limits</h2>
<p>Fast, no domain knowledge needed, easy to read and convert to rules, handles mixed attributes. But it can overfit, is unstable with small data changes, and splits on one attribute at a time.</p>
<div class="tip"><b>Exam tip.</b> Show Info(D), then the Info and Gain for every attribute in a small table, circle the best, and draw the tree. Round to three decimals. A common 16-mark question gives a 10 to 14 row table and asks for the tree.</div>`,
    qa: [
      Q(2, 'What is information gain?', 'Gain(A) = Info(D) − Info<sub>A</sub>(D): the reduction in entropy achieved by splitting on attribute A. ID3 splits on the attribute with the highest gain.'),
      Q(2, 'Write the formula for the Gini index.', 'Gini(D) = 1 − Σ p<sub>i</sub>², where p<sub>i</sub> is the proportion of tuples of class i. CART picks the split with the lowest weighted Gini.'),
      Q(2, 'Why is tree pruning needed?', 'To remove branches that fit noise or outliers, which reduces overfitting and gives a smaller tree that classifies unseen data more accurately.'),
      Q(5, 'Differentiate information gain, gain ratio and Gini index.', 'Table of the three measures with formula, algorithm (ID3, C4.5, CART), and the bias of information gain towards many-valued attributes.'),
      Q(8, 'Explain the decision tree induction algorithm with an example.', '<p>Definition and node types (1). Algorithm steps and stopping rules (3). Attribute selection with the information gain formula (2). A small example with one split computed (2).</p>'),
      Q(16, 'Construct a decision tree for the buys_computer data using information gain.', '<p>Table (1). Info(D) = 0.940 (2). Info and Gain for age, income, student, credit_rating = 0.246, 0.029, 0.151, 0.048 (5). Root = age, branches (2). Subtrees: youth → student, senior → credit_rating, middle → yes (4). Draw the tree and write the rules (2).</p>'),
    ],
  },
  {
    id: 'm3-4', mod: 'm3', title: 'Bayesian classification', pr: 'Very High',
    tags: 'bayesian classification naive bayes theorem prior posterior likelihood laplacian correction belief network',
    body: `
<div class="def"><b>Definition.</b> Bayesian classifiers are statistical classifiers that predict the <b>probability</b> that a tuple belongs to each class. <b>Naive Bayes</b> assumes that the attributes are <b>class conditionally independent</b>.</div>
<h2>Bayes' theorem</h2>
<p><b>P(H | X) = P(X | H) × P(H) / P(X)</b></p>
<ul><li>X = tuple (evidence), H = hypothesis that X belongs to class C<sub>i</sub>.</li><li>P(H | X) = <b>posterior</b> probability, P(H) = <b>prior</b>, P(X | H) = <b>likelihood</b>, P(X) = evidence (same for all classes).</li></ul>
<h2>Naive Bayes algorithm</h2>
<ol><li>Compute the prior P(C<sub>i</sub>) = (tuples of class C<sub>i</sub>) / (all tuples).</li><li>For each attribute value x<sub>k</sub> of X, compute P(x<sub>k</sub> | C<sub>i</sub>) = (tuples of class C<sub>i</sub> having x<sub>k</sub>) / (tuples of class C<sub>i</sub>). For a continuous attribute use a Gaussian density with the class mean and standard deviation.</li><li>Because of independence, <b>P(X | C<sub>i</sub>) = Π<sub>k</sub> P(x<sub>k</sub> | C<sub>i</sub>)</b>.</li><li>Since P(X) is constant, compare <b>P(X | C<sub>i</sub>) × P(C<sub>i</sub>)</b> for every class.</li><li>Predict the class with the largest value.</li></ol>
<h2>Worked example (buys_computer table from the decision tree topic)</h2>
<p>Classify X = (age = youth, income = medium, student = yes, credit_rating = fair).</p>
<pre>P(yes) = 9/14 = 0.643      P(no) = 5/14 = 0.357

For yes:  P(youth|yes) = 2/9 = 0.222     P(medium|yes) = 4/9 = 0.444
          P(student=yes|yes) = 6/9 = 0.667   P(fair|yes) = 6/9 = 0.667
For no:   P(youth|no) = 3/5 = 0.600      P(medium|no) = 2/5 = 0.400
          P(student=yes|no) = 1/5 = 0.200    P(fair|no) = 2/5 = 0.400

P(X|yes) = 0.222 × 0.444 × 0.667 × 0.667 = 0.044
P(X|no)  = 0.600 × 0.400 × 0.200 × 0.400 = 0.019

P(X|yes) P(yes) = 0.044 × 0.643 = 0.028
P(X|no)  P(no)  = 0.019 × 0.357 = 0.007

0.028 &gt; 0.007, so X is classified as buys_computer = yes
Normalised: P(yes|X) = 0.028 / (0.028 + 0.007) = 0.80</pre>
<div data-w="bayes"></div>
<h2>Laplacian correction (smoothing)</h2>
<p>If some P(x<sub>k</sub> | C<sub>i</sub>) = 0, the whole product becomes 0. Add 1 to every count: P = (count + 1) / (class size + number of values of the attribute). Example: a class of 1000 tuples with income counts 0, 990, 10 becomes 1/1003, 991/1003, 11/1003.</p>
<h2>Bayesian belief networks</h2>
<p>When attributes are dependent, use a <b>Bayesian belief network</b>: a directed acyclic graph whose nodes are variables and edges are dependencies, plus a <b>conditional probability table</b> for each node. The joint probability is P(x₁ … x<sub>n</sub>) = Π P(x<sub>i</sub> | Parents(x<sub>i</sub>)).</p>
<h2>Strengths and weaknesses</h2>
<p>Simple, fast, works well with small data and many attributes, gives probabilities. The independence assumption is often false, and zero counts need smoothing.</p>
<div class="tip"><b>Exam tip.</b> Write every conditional probability as a fraction before multiplying, compute both classes, then compare. State the decision in one sentence.</div>`,
    qa: [
      Q(2, 'State Bayes theorem.', 'P(H|X) = P(X|H) P(H) / P(X): the posterior probability of hypothesis H given evidence X equals the likelihood times the prior divided by the evidence probability.'),
      Q(2, 'Why is naive Bayes called naive?', 'It assumes the attributes are conditionally independent given the class, which is a simplifying (often unrealistic) assumption.'),
      Q(2, 'What is the Laplacian correction?', 'Adding 1 to every count so that no conditional probability is zero, which would otherwise wipe out the product.'),
      Q(5, 'Explain naive Bayesian classification.', 'Bayes theorem, independence assumption, the product P(X|C<sub>i</sub>) P(C<sub>i</sub>), and the decision rule (largest value wins).'),
      Q(8, 'Classify X = (youth, medium, student, fair) using naive Bayes.', '<p>Priors 9/14 and 5/14 (1). Eight conditional probabilities (3). P(X|yes) = 0.044, P(X|no) = 0.019 (2). Multiply by priors 0.028 versus 0.007 (1). Conclusion: yes (1).</p>'),
      Q(16, 'Explain Bayesian classification: theorem, naive Bayes, example, Laplacian correction and belief networks.', '<p>Theorem and terms (3). Naive Bayes steps (3). Worked example (5). Laplacian correction (2). Bayesian belief network with CPT and joint probability (3).</p>'),
    ],
  },
  {
    id: 'm3-5', mod: 'm3', title: 'Rule-based classification', pr: 'Important',
    tags: 'rule based classification if then rules coverage accuracy sequential covering rule extraction decision tree conflict resolution',
    body: `
<div class="def"><b>Definition.</b> A rule-based classifier uses a set of <b>IF-THEN rules</b>: <code>IF condition THEN class</code>. The IF part is the <b>antecedent (precondition)</b>, the THEN part is the <b>consequent</b>. Example: IF age = youth AND student = yes THEN buys_computer = yes.</div>
<h2>Rule quality</h2>
<p>For a rule R covering tuples in D: <b>coverage(R)</b> = n<sub>covers</sub> / |D| (how many tuples the antecedent matches), <b>accuracy(R)</b> = n<sub>correct</sub> / n<sub>covers</sub> (how many of those have the predicted class).</p>
<p>Example: a rule covers 2 of 14 tuples and both are correct → coverage 14.28%, accuracy 100%.</p>
<h2>Conflict resolution</h2>
<ul><li>A tuple may trigger several rules with different classes: <b>size ordering</b> (the rule with the toughest, longest antecedent fires) or <b>rule ordering</b> (a decision list, ordered by accuracy, coverage, class or domain knowledge).</li><li>If no rule fires, use a <b>default rule</b>.</li></ul>
<h2>1. Rules from a decision tree</h2>
<p>One rule per root-to-leaf path: AND the tests along the path as the antecedent, the leaf class is the consequent. Rules are mutually exclusive and exhaustive. Easier to read than a big tree.</p>
<h2>2. Sequential covering algorithm</h2>
<ol><li>Learn one rule that covers many tuples of one class and none (or few) of other classes (<b>Learn_One_Rule</b>: start with an empty antecedent and greedily add the attribute test with the best accuracy or FOIL gain).</li><li>Remove the tuples the rule covers.</li><li>Repeat for the remaining tuples until the stopping condition (no tuples of the class are left or rule quality falls below a threshold).</li><li>Repeat for every class.</li></ol>
<p>Rules are learned <b>one at a time</b>, unlike a tree where all splits are learned together. Examples: AQ, CN2, RIPPER, FOIL.</p>
<h2>Rule pruning</h2>
<p>Remove a conjunct if the rule then does better on an independent pruning set (FOIL_Prune).</p>`,
    qa: [
      Q(2, 'Define coverage and accuracy of a rule.', 'Coverage = fraction of all tuples that satisfy the rule antecedent. Accuracy = fraction of covered tuples that the rule classifies correctly.'),
      Q(5, 'How are IF-THEN rules extracted from a decision tree?', 'One rule per leaf; AND the attribute tests along the path to form the antecedent, leaf label as consequent. Give the buys_computer rules as an example.'),
      Q(8, 'Explain the sequential covering algorithm.', '<p>Idea: learn one rule at a time (2). Learn_One_Rule, greedy addition of tests (2). Remove covered tuples and repeat (2). Per-class loop, pruning and conflict resolution (2).</p>'),
    ],
  },
  {
    id: 'm3-6', mod: 'm3', title: 'Backpropagation', pr: 'High',
    tags: 'backpropagation neural network sigmoid weights bias error learning rate multilayer feed forward gradient',
    body: `
<div class="def"><b>Definition.</b> Backpropagation is a neural network learning algorithm for a <b>multilayer feed-forward network</b>. It repeatedly passes the training tuples forward, compares the network output with the target, and <b>propagates the error backwards</b> to adjust weights so that the output moves closer to the target.</div>
<h2>Network structure</h2>
<p>An <b>input layer</b> (one unit per attribute), one or more <b>hidden layers</b>, and an <b>output layer</b> (one unit per class). Each connection has a weight w<sub>ij</sub>; each unit (except input) has a bias θ<sub>j</sub>. Inputs should be normalised to 0 to 1.</p>
<div data-w="diag:nn"></div>
<h2>Algorithm</h2>
<ol><li><b>Initialise</b> all weights and biases to small random numbers.</li><li><b>Propagate the inputs forward.</b> For each unit j: net input I<sub>j</sub> = Σ<sub>i</sub> w<sub>ij</sub> O<sub>i</sub> + θ<sub>j</sub>, output <b>O<sub>j</sub> = 1 / (1 + e<sup>−I<sub>j</sub></sup>)</b> (sigmoid).</li><li><b>Backpropagate the error.</b><br>Output unit: <b>Err<sub>j</sub> = O<sub>j</sub> (1 − O<sub>j</sub>)(T<sub>j</sub> − O<sub>j</sub>)</b><br>Hidden unit: <b>Err<sub>j</sub> = O<sub>j</sub> (1 − O<sub>j</sub>) Σ<sub>k</sub> Err<sub>k</sub> w<sub>jk</sub></b></li><li><b>Update.</b> w<sub>ij</sub> = w<sub>ij</sub> + (l) Err<sub>j</sub> O<sub>i</sub>;  θ<sub>j</sub> = θ<sub>j</sub> + (l) Err<sub>j</sub>  (l = learning rate).</li><li><b>Terminate</b> when the weight changes are tiny, the error is small, or a set number of epochs is reached.</li></ol>
<h2>Worked example</h2>
<p>Inputs x₁ = 0.35, x₂ = 0.9; weights w₁₃ = 0.1, w₂₃ = 0.8, w₁₄ = 0.4, w₂₄ = 0.6, w₃₅ = 0.3, w₄₅ = 0.9; biases 0; target T = 0.5; learning rate l = 1.</p>
<pre>Forward:
 I₃ = 0.35×0.1 + 0.9×0.8 = 0.755   O₃ = 1/(1+e^−0.755) = 0.680
 I₄ = 0.35×0.4 + 0.9×0.6 = 0.680   O₄ = 0.664
 I₅ = 0.680×0.3 + 0.664×0.9 = 0.802   O₅ = 0.690
Error at output: Err₅ = 0.690 × (1 − 0.690) × (0.5 − 0.690) = −0.0407
Hidden errors:
 Err₃ = 0.680 × 0.320 × (−0.0407 × 0.3) = −0.00265
 Err₄ = 0.664 × 0.336 × (−0.0407 × 0.9) = −0.00817
Update weights:
 w₃₅ = 0.3 + 1×(−0.0407)(0.680) = 0.272     w₄₅ = 0.9 + (−0.0407)(0.664) = 0.873
 w₁₃ = 0.1 + (−0.00265)(0.35) = 0.099       w₂₃ = 0.8 + (−0.00265)(0.9) = 0.798
 w₁₄ = 0.4 + (−0.00817)(0.35) = 0.397       w₂₄ = 0.6 + (−0.00817)(0.9) = 0.593</pre>
<div data-w="bp"></div>
<h2>Points to remember</h2>
<ul><li><b>Epoch</b> = one pass over all training tuples. Updating after every tuple is <b>case updating</b>; after a whole epoch it is <b>epoch updating</b>.</li><li>Backpropagation performs <b>gradient descent</b> on the squared error and can get stuck in a local minimum.</li><li><b>Strengths:</b> high tolerance to noisy data, can classify untrained patterns. <b>Weaknesses:</b> long training time, many parameters (network design, learning rate), poor interpretability.</li><li>Rule extraction and network pruning are used to improve interpretability.</li></ul>`,
    qa: [
      Q(2, 'What is the role of the activation (sigmoid) function?', 'It squashes the net input into the range 0 to 1 using O = 1/(1 + e^−I), making the unit non-linear and its derivative O(1 − O) easy to compute.'),
      Q(2, 'Write the weight update rule in backpropagation.', 'w<sub>ij</sub> = w<sub>ij</sub> + (l) Err<sub>j</sub> O<sub>i</sub>, with learning rate l; biases: θ<sub>j</sub> = θ<sub>j</sub> + (l) Err<sub>j</sub>.'),
      Q(5, 'List the strengths and weaknesses of backpropagation.', 'Strengths: tolerant of noise, works with continuous inputs, can learn complex patterns. Weaknesses: long training, parameters to tune, local minima, no easy explanation of the result.'),
      Q(8, 'Explain the backpropagation algorithm with a diagram.', '<p>Network figure (2). Initialisation (1). Forward propagation formulas (2). Error formulas for output and hidden units (2). Weight and bias updates, termination (1).</p>'),
      Q(16, 'Compute one iteration of backpropagation for the given network (inputs 0.35, 0.9, target 0.5).', '<p>Forward pass with I and O for units 3, 4, 5 (6). Output error −0.0407 (3). Hidden errors −0.00265 and −0.00817 (3). New weights (4).</p>'),
    ],
  },
  {
    id: 'm3-7', mod: 'm3', title: 'Support Vector Machines (SVM)', pr: 'High',
    tags: 'svm support vector machine hyperplane margin kernel soft margin maximum marginal hyperplane linear nonlinear',
    body: `
<div class="def"><b>Definition.</b> A Support Vector Machine finds the <b>maximum marginal hyperplane (MMH)</b>: the decision boundary that separates two classes with the <b>widest margin</b>. The tuples that lie on the margin edges are the <b>support vectors</b>.</div>
<h2>Linearly separable case</h2>
<ul><li>Hyperplane: <b>w · x + b = 0</b>, with class labels y = +1 or −1.</li><li>Class +1 satisfies w · x + b ≥ +1, class −1 satisfies w · x + b ≤ −1, so <b>y(w · x + b) ≥ 1</b> for every tuple.</li><li>The two margin hyperplanes w · x + b = ±1 are at distance 1/‖w‖ from the MMH, so <b>margin = 2/‖w‖</b>.</li><li>Maximising the margin means <b>minimising ‖w‖²/2</b> subject to y<sub>i</sub>(w · x<sub>i</sub> + b) ≥ 1. This is a convex quadratic problem solved with Lagrange multipliers, so there is a unique global optimum (no local minima).</li><li>Decision function: <b>f(x) = sign( Σ α<sub>i</sub> y<sub>i</sub> (x<sub>i</sub> · x) + b )</b>, summed over the support vectors only.</li></ul>
<div data-w="svm"></div>
<p><b>Example.</b> Class +1: (3,1), (3,−1), (6,1), (6,−1). Class −1: (1,0), (0,1), (0,−1), (−1,0). The support vectors are (1,0), (3,1), (3,−1); the best hyperplane is the vertical line x = 2, that is w = (1, 0), b = −2. Check: for (3,1), w·x + b = 1; for (1,0), w·x + b = −1. Margin = 2/‖w‖ = 2.</p>
<h2>Linearly inseparable data</h2>
<ol><li><b>Soft margin:</b> allow some tuples inside the margin with slack ξ<sub>i</sub> ≥ 0, minimising ‖w‖²/2 + C Σ ξ<sub>i</sub>. A large C punishes errors (small margin, risk of overfitting); a small C allows a wide margin.</li><li><b>Kernel trick:</b> map the data to a higher-dimensional space where it becomes linearly separable, and replace the dot product by a kernel K(x<sub>i</sub>, x<sub>j</sub>) so the mapping is never computed explicitly.</li></ol>
<table><tr><th>Kernel</th><th>K(x<sub>i</sub>, x<sub>j</sub>)</th></tr>
<tr><td>Polynomial of degree h</td><td>(x<sub>i</sub> · x<sub>j</sub> + 1)<sup>h</sup></td></tr>
<tr><td>Gaussian radial basis function</td><td>exp(−‖x<sub>i</sub> − x<sub>j</sub>‖² / 2σ²)</td></tr>
<tr><td>Sigmoid</td><td>tanh(κ x<sub>i</sub> · x<sub>j</sub> − δ)</td></tr></table>
<h2>Strengths and weaknesses</h2>
<p>Highly accurate, resists overfitting because complexity depends on the number of support vectors, not on dimensionality, handles high-dimensional data. Training is slow on very large data, and choosing the kernel and C is by trial. Natively binary; for k classes use one-versus-all or one-versus-one.</p>`,
    qa: [
      Q(2, 'What are support vectors?', 'The training tuples that lie exactly on the margin hyperplanes w·x + b = ±1, closest to the decision boundary; they alone define the MMH.'),
      Q(2, 'Give the margin of a hyperplane w·x + b = 0.', 'Margin = 2/‖w‖, so maximising it means minimising ‖w‖.'),
      Q(2, 'What is the kernel trick?', 'Computing dot products in a higher-dimensional space through a kernel function K(x<sub>i</sub>, x<sub>j</sub>) without actually mapping the data, so non-linear boundaries can be learned.'),
      Q(5, 'Explain how SVM handles linearly inseparable data.', 'Soft margin with slack variables and parameter C, and the kernel trick with the polynomial, RBF and sigmoid kernels.'),
      Q(8, 'Explain support vector machines for linearly separable data with a diagram.', '<p>Idea of MMH and support vectors (2). Equations of the hyperplane and margins (2). Margin = 2/‖w‖ and the optimisation problem (2). Decision function (1). Strengths (1).</p>'),
    ],
  },
  {
    id: 'm3-8', mod: 'm3', title: 'Associative classification', pr: 'Important',
    tags: 'associative classification class association rules cba cmar cpar frequent patterns support confidence',
    body: `
<div class="def"><b>Definition.</b> Associative classification builds a classifier from <b>class association rules</b>: rules of the form <code>(A₁ = a₁) ∧ … ∧ (A<sub>n</sub> = a<sub>n</sub>) ⇒ class = C</code> found by <b>association rule mining</b>. It combines mining of frequent patterns with classification.</div>
<h2>General steps</h2>
<ol><li><b>Mine frequent itemsets</b> in the training data, treating each (attribute, value) pair as an item and the class label as an item.</li><li><b>Generate class association rules</b> whose consequent is a class label, keeping those that meet minimum <b>support</b> (fraction of tuples containing the antecedent and the class) and minimum <b>confidence</b> (fraction of tuples with the antecedent that also have the class).</li><li><b>Organise the rules</b> and select a good subset (rank by confidence, then support, then shorter antecedent first) to build the classifier.</li><li><b>Classify</b> a new tuple using the best matching rule, or by combining several matching rules.</li></ol>
<table><tr><th>Method</th><th>Idea</th></tr>
<tr><td><b>CBA</b> (Classification Based on Associations)</td><td>Apriori-style mining of class association rules, rules ranked and pruned into an ordered list; the first matching rule classifies the tuple.</td></tr>
<tr><td><b>CMAR</b> (Classification based on Multiple Association Rules)</td><td>Uses an FP-tree for mining, stores rules in a CR-tree, and classifies by a <b>weighted χ²</b> vote of all matching rules, so it does not depend on a single rule.</td></tr>
<tr><td><b>CPAR</b> (Classification based on Predictive Association Rules)</td><td>Generates rules directly from the data in a FOIL-like greedy manner (no full frequent-pattern mining), keeps several best rules per class and uses the best k.</td></tr></table>
<h2>Why use it</h2>
<p>Association rules can capture strong relations between many attribute-value pairs together, which a decision tree (one attribute per split) may miss. Studies show higher accuracy than C4.5 and often than SVM on some data. The downside is the large number of rules that must be pruned.</p>`,
    qa: [
      Q(2, 'What is a class association rule?', 'An association rule whose consequent is a class label, such as (age = youth) ∧ (student = yes) ⇒ buys = yes, with its support and confidence.'),
      Q(5, 'Explain associative classification and name its three methods.', 'Steps of mining, rule selection and classification; CBA, CMAR and CPAR with one line each.'),
      Q(8, 'Compare CBA, CMAR and CPAR.', '<p>Table: mining technique (Apriori, FP-tree, FOIL-style), rule storage and ranking, how a tuple is classified (single rule, weighted χ² of many rules, best k rules per class). Add strengths and weaknesses.</p>'),
    ],
  },
  {
    id: 'm3-9', mod: 'm3', title: 'Lazy learners', pr: 'Important',
    tags: 'lazy learners k nearest neighbor knn case based reasoning instance based eager learner',
    body: `
<div class="def"><b>Definition.</b> A <b>lazy learner</b> stores the training tuples and does no work until it must classify a new tuple. An <b>eager learner</b> (decision tree, Bayes, SVM, backpropagation) builds the model first.</div>
<h2>k-nearest neighbour (kNN)</h2>
<ol><li>Store all training tuples as points in n-dimensional space.</li><li>For an unknown tuple X compute the <b>distance</b> to every training tuple, usually Euclidean: d(X, Y) = √Σ (x<sub>i</sub> − y<sub>i</sub>)².</li><li>Take the <b>k nearest</b> tuples.</li><li>Assign the <b>majority class</b> among them (for numeric prediction, return the average of their values).</li></ol>
<p><b>Practical points.</b> Normalise attributes (min-max) so large-range attributes do not dominate. For categorical attributes use distance 0 if equal, 1 if different. Choose k by testing: a small k is noisy, a large k blurs the boundary. Weight each neighbour by 1/d² for better results. Missing values: assume the maximum possible difference.</p>
<div data-w="knn"></div>
<h2>Case-based reasoning (CBR)</h2>
<p>Training tuples are stored as <b>cases</b> (a problem description and its solution, symbolic rather than numeric). Given a new case: (1) look for an identical case; (2) if none, retrieve similar cases; (3) <b>adapt</b> their solutions to the new problem, using background knowledge; (4) store the new case. Used in help desks and legal reasoning. Challenges: finding a good similarity measure, indexing the case base efficiently.</p>
<h2>Eager versus lazy</h2>
<table><tr><th></th><th>Eager learner</th><th>Lazy learner</th></tr>
<tr><td>Training time</td><td>Long (builds a model)</td><td>None, just stores data</td></tr>
<tr><td>Classification time</td><td>Short</td><td>Long (compares with all tuples)</td></tr>
<tr><td>Model</td><td>One global model</td><td>Local approximation per query</td></tr>
<tr><td>Storage</td><td>Small model</td><td>Whole training set</td></tr>
<tr><td>Examples</td><td>Decision tree, naive Bayes, SVM</td><td>kNN, CBR</td></tr></table>`,
    qa: [
      Q(2, 'What is a lazy learner? Give an example.', 'A method that only stores the training tuples and defers all computation until a new tuple arrives, such as k-nearest neighbour.'),
      Q(2, 'Why must attributes be normalised in kNN?', 'Otherwise an attribute with a large range (income) dominates the distance over one with a small range (age).'),
      Q(5, 'Explain the k-nearest neighbour classifier.', 'Steps, the Euclidean distance formula, choice of k, normalisation and the weighted vote.'),
      Q(8, 'Compare eager and lazy learners, and explain case-based reasoning.', '<p>Table (4). Definition and four CBR steps (3). Issues in CBR (1).</p>'),
    ],
  },
  {
    id: 'm3-10', mod: 'm3', title: 'Model evaluation', pr: 'High',
    tags: 'model evaluation holdout cross validation bootstrap roc curve auc model selection stratified leave one out ensemble bagging boosting',
    body: `
<div class="def"><b>Goal.</b> Estimate how well a classifier will do on <b>new data</b>. Testing on the training data is over-optimistic, so the data is split.</div>
<h2>Methods to estimate accuracy</h2>
<table><tr><th>Method</th><th>How it works</th></tr>
<tr><td><b>Holdout</b></td><td>Randomly split into training (usually 2/3) and test (1/3). Train on one, test on the other.</td></tr>
<tr><td><b>Random subsampling</b></td><td>Repeat holdout k times, average the accuracy.</td></tr>
<tr><td><b>k-fold cross-validation</b></td><td>Split data into k equal folds. In round i, fold i is the test set and the rest is training. Repeat k times; accuracy = total correct / total tuples. k = 10 is standard. <b>Stratified</b> keeps the class ratio in each fold.</td></tr>
<tr><td><b>Leave-one-out</b></td><td>k = number of tuples. Only one tuple is tested each time. Good for small data, costly.</td></tr>
<tr><td><b>Bootstrap</b></td><td>Sample n tuples <b>with replacement</b> for training; the tuples never picked (about 36.8%) form the test set. <b>.632 bootstrap:</b> Acc = Σ (0.632 × Acc(M<sub>i</sub>)<sub>test</sub> + 0.368 × Acc(M<sub>i</sub>)<sub>train</sub>), over k repetitions.</td></tr></table>
<h2>ROC curve</h2>
<p>The <b>Receiver Operating Characteristic</b> curve plots the <b>true positive rate</b> (TPR = TP/P) on the y-axis against the <b>false positive rate</b> (FPR = FP/N) on the x-axis as the decision threshold changes. Sort tuples by the probability of the positive class and move the threshold down the list. The diagonal is random guessing; a curve nearer the top-left corner is better. The <b>area under the curve (AUC)</b> measures accuracy: 0.5 = random, 1.0 = perfect.</p>
<h2>Model selection</h2>
<p>To choose between two models M₁ and M₂, compare mean error rates over k-fold runs with a <b>t-test</b> (paired, same folds): t = (mean err₁ − mean err₂) / √(var(M₁ − M₂)/k). If the result exceeds the critical value at the chosen <b>significance level</b> (for example 5%), the difference is statistically significant, not chance.</p>
<h2>Improving accuracy: ensembles</h2>
<ul><li><b>Bagging:</b> train several classifiers on bootstrap samples, take a <b>majority vote</b>. Reduces variance.</li><li><b>Boosting (AdaBoost):</b> train classifiers one after another; misclassified tuples get larger weights so the next classifier focuses on them; the final vote is weighted by each classifier's accuracy.</li><li><b>Random forest:</b> bagging of decision trees with a random subset of attributes at each split.</li></ul>
<h2>Class imbalance</h2>
<p>Oversample the rare class, undersample the common class, or give errors on the rare class a higher cost.</p>`,
    qa: [
      Q(2, 'What is k-fold cross-validation?', 'The data is split into k equal folds; each fold is used once as the test set while the other k − 1 train the model. The k results are combined into one accuracy estimate.'),
      Q(2, 'What does AUC represent?', 'The area under the ROC curve: the probability that the classifier ranks a random positive tuple above a random negative one. 0.5 is chance, 1.0 is perfect.'),
      Q(5, 'Explain holdout, k-fold cross-validation and bootstrap.', 'One paragraph each: split ratio, rounds, with-replacement sampling and the 63.2%/36.8% idea.'),
      Q(8, 'Explain ROC curves and how they are used to compare classifiers.', '<p>Definition with TPR and FPR (2). How the curve is drawn from a ranked list (2). Diagonal line, AUC interpretation (2). Comparing two models: larger AUC wins (2).</p>'),
      Q(8, 'Explain ensemble methods: bagging and boosting.', '<p>Bagging steps and vote (3). Boosting with weights and weighted vote (3). Compare: parallel versus sequential, variance versus bias (2).</p>'),
    ],
  },
  {
    id: 'm3-11', mod: 'm3', title: 'Accuracy and error measures', pr: 'High',
    tags: 'accuracy error measures confusion matrix precision recall sensitivity specificity f measure mean absolute error rmse kappa',
    body: `
<h2>Confusion matrix</h2>
<table><tr><th></th><th>Predicted positive</th><th>Predicted negative</th><th>Total</th></tr>
<tr><td><b>Actual positive</b></td><td>TP (true positive)</td><td>FN (false negative)</td><td>P</td></tr>
<tr><td><b>Actual negative</b></td><td>FP (false positive)</td><td>TN (true negative)</td><td>N</td></tr></table>
<h2>Classifier measures</h2>
<table><tr><th>Measure</th><th>Formula</th><th>Meaning</th></tr>
<tr><td><b>Accuracy</b> (recognition rate)</td><td>(TP + TN) / (P + N)</td><td>Fraction of all tuples classified correctly</td></tr>
<tr><td><b>Error rate</b></td><td>(FP + FN) / (P + N) = 1 − accuracy</td><td>Fraction misclassified</td></tr>
<tr><td><b>Sensitivity</b> (recall, true positive rate)</td><td>TP / P</td><td>How many real positives were found</td></tr>
<tr><td><b>Specificity</b> (true negative rate)</td><td>TN / N</td><td>How many real negatives were found</td></tr>
<tr><td><b>Precision</b></td><td>TP / (TP + FP)</td><td>Of those predicted positive, how many really are</td></tr>
<tr><td><b>F-measure (F₁)</b></td><td>2 × precision × recall / (precision + recall)</td><td>Harmonic mean of precision and recall</td></tr>
<tr><td><b>F<sub>β</sub></b></td><td>(1 + β²) × precision × recall / (β² × precision + recall)</td><td>β &gt; 1 weights recall more, β &lt; 1 weights precision more</td></tr></table>
<p>Accuracy = sensitivity × P/(P+N) + specificity × N/(P+N).</p>
<div class="ex"><b>Worked example.</b> TP = 90, FN = 10, FP = 30, TN = 170 (P = 100, N = 200, total 300).
<pre>Accuracy    = (90 + 170) / 300 = 0.867 (86.7%)
Error rate  = 40 / 300 = 0.133
Sensitivity = 90 / 100 = 0.90
Specificity = 170 / 200 = 0.85
Precision   = 90 / 120 = 0.75
F₁          = 2 × 0.75 × 0.90 / (0.75 + 0.90) = 0.818</pre></div>
<div data-w="metrics"></div>
<p><b>Why accuracy misleads.</b> With 1% positive data, a model that always says "negative" is 99% accurate yet finds no positive. Use sensitivity, precision and F₁ for imbalanced classes. <b>Kappa</b> = (accuracy − chance agreement) / (1 − chance agreement) corrects for chance.</p>
<h2>Measures for numeric prediction</h2>
<p>For actual values y<sub>i</sub> and predictions y′<sub>i</sub> over d tuples:</p>
<table><tr><th>Measure</th><th>Formula</th></tr>
<tr><td>Mean absolute error (MAE)</td><td>Σ |y<sub>i</sub> − y′<sub>i</sub>| / d</td></tr>
<tr><td>Mean squared error (MSE)</td><td>Σ (y<sub>i</sub> − y′<sub>i</sub>)² / d</td></tr>
<tr><td>Root mean squared error (RMSE)</td><td>√MSE</td></tr>
<tr><td>Relative absolute error</td><td>Σ |y<sub>i</sub> − y′<sub>i</sub>| / Σ |y<sub>i</sub> − ȳ|</td></tr>
<tr><td>Relative squared error</td><td>Σ (y<sub>i</sub> − y′<sub>i</sub>)² / Σ (y<sub>i</sub> − ȳ)²</td></tr>
<tr><td>Coefficient of determination R²</td><td>1 − relative squared error</td></tr></table>
<p>RMSE punishes large errors more than MAE. Relative errors compare the model with the trivial predictor ȳ (the mean).</p>`,
    qa: [
      Q(2, 'Define precision and recall.', 'Precision = TP/(TP + FP), the share of predicted positives that are correct. Recall = TP/(TP + FN) = TP/P, the share of actual positives that are found.'),
      Q(2, 'What is a confusion matrix?', 'A table of actual versus predicted classes with TP, FN, FP, TN, from which accuracy and the other measures are computed.'),
      Q(5, 'Explain the classifier evaluation measures with formulas.', 'Accuracy, error rate, sensitivity, specificity, precision, F-measure, each with its formula from the table.'),
      Q(8, 'Given TP = 90, FN = 10, FP = 30, TN = 170, compute accuracy, error rate, sensitivity, specificity, precision and F₁.', '<p>Matrix with P = 100, N = 200 (1). Accuracy 0.867 (1.5). Error rate 0.133 (1). Sensitivity 0.90 (1.5). Specificity 0.85 (1.5). Precision 0.75 and F₁ 0.818 (1.5).</p>'),
      Q(5, 'Explain the error measures for numeric prediction.', 'MAE, MSE, RMSE, relative absolute and squared errors and R², with formulas and the point that RMSE penalises large errors.'),
    ],
  },
];

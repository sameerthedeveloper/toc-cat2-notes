const Q = (m, q, a) => ({ m, q, a });

export const T4 = [
  {
    id: 'm4-1', mod: 'm4', title: 'Introduction to cluster analysis', pr: 'High',
    tags: 'cluster analysis clustering introduction unsupervised requirements applications similarity intra inter cluster',
    body: `
<div class="def"><b>Definition.</b> Cluster analysis groups a set of data objects into <b>clusters</b> so that objects in the same cluster are <b>similar</b> to one another and <b>dissimilar</b> to objects in other clusters. It is <b>unsupervised</b> learning: there are no class labels, so it is also called learning by observation.</div>
<p>A good clustering has <b>high intra-cluster similarity</b> and <b>low inter-cluster similarity</b>. The quality depends on the similarity measure, the method and its ability to find hidden patterns.</p>
<h2>Applications</h2>
<ul><li><b>Business:</b> customer segmentation for marketing.</li><li><b>Biology:</b> grouping genes and species.</li><li><b>Web:</b> grouping documents and search results; recommendation.</li><li><b>Images:</b> segmentation, pattern recognition.</li><li><b>Outlier detection and fraud:</b> objects that fit no cluster.</li><li><b>Preprocessing:</b> summarising and compressing data.</li></ul>
<h2>Requirements of a good clustering method</h2>
<ol><li><b>Scalability</b> for millions of objects.</li><li>Ability to handle <b>different attribute types</b> (numeric, binary, nominal, mixed).</li><li>Discovery of clusters with <b>arbitrary shape</b> (not just spherical).</li><li><b>Minimal domain knowledge</b> to set input parameters.</li><li>Ability to deal with <b>noise and outliers</b>.</li><li><b>Insensitivity to the order</b> of input records.</li><li>Support for <b>high dimensionality</b>.</li><li><b>Constraint-based</b> clustering (user constraints).</li><li><b>Interpretability and usability</b> of results.</li></ol>
<h2>Clustering versus classification</h2>
<table><tr><th></th><th>Clustering</th><th>Classification</th></tr>
<tr><td>Learning</td><td>Unsupervised</td><td>Supervised</td></tr><tr><td>Class labels</td><td>Not available</td><td>Available for training</td></tr><tr><td>Groups</td><td>Found from the data</td><td>Predefined</td></tr></table>`,
    qa: [
      Q(2, 'Define cluster analysis.', 'Grouping data objects into clusters so that similarity within a cluster is high and similarity between clusters is low, without using class labels.'),
      Q(2, 'Why is clustering called unsupervised learning?', 'Because the groups are not known in advance and the data carries no class labels to learn from; the structure is discovered from the data.'),
      Q(5, 'List the requirements of clustering in data mining.', 'Scalability, different attribute types, arbitrary shapes, minimal domain knowledge, noise handling, order insensitivity, high dimensionality, constraints, interpretability, with one line each.'),
    ],
  },
  {
    id: 'm4-2', mod: 'm4', title: 'Types of data in cluster analysis', pr: 'Important',
    tags: 'types of data cluster analysis interval scaled binary nominal ordinal ratio mixed dissimilarity matrix data matrix euclidean manhattan minkowski jaccard',
    body: `
<h2>Two data structures</h2>
<ul><li><b>Data matrix</b> (object-by-variable): n objects × p variables. Two-mode matrix.</li><li><b>Dissimilarity matrix</b> (object-by-object): n × n table of d(i, j), the distance between objects i and j. d(i, i) = 0 and d(i, j) = d(j, i), so it is a lower-triangular table. One-mode matrix. Most clustering algorithms work on this.</li></ul>
<h2>1. Interval-scaled variables</h2>
<p>Continuous measurements on a linear scale (weight, temperature). Different units distort distance, so <b>standardise</b>: mean absolute deviation s<sub>f</sub> = (1/n)(|x₁<sub>f</sub> − m<sub>f</sub>| + … + |x<sub>nf</sub> − m<sub>f</sub>|), then z-score <b>z<sub>if</sub> = (x<sub>if</sub> − m<sub>f</sub>) / s<sub>f</sub></b>.</p>
<table><tr><th>Distance</th><th>Formula</th></tr>
<tr><td>Euclidean</td><td>d(i, j) = √(|x<sub>i1</sub> − x<sub>j1</sub>|² + … + |x<sub>ip</sub> − x<sub>jp</sub>|²)</td></tr>
<tr><td>Manhattan (city block)</td><td>d(i, j) = |x<sub>i1</sub> − x<sub>j1</sub>| + … + |x<sub>ip</sub> − x<sub>jp</sub>|</td></tr>
<tr><td>Minkowski</td><td>d(i, j) = (|x<sub>i1</sub> − x<sub>j1</sub>|<sup>q</sup> + … + |x<sub>ip</sub> − x<sub>jp</sub>|<sup>q</sup>)<sup>1/q</sup> (q = 1 Manhattan, q = 2 Euclidean)</td></tr></table>
<p>Example: i = (1, 2), j = (4, 6): Euclidean = √(9 + 16) = 5, Manhattan = 3 + 4 = 7.</p>
<h2>2. Binary variables</h2>
<p>Only 0 and 1. Build the contingency table for objects i and j: q = both 1, r = i is 1 and j is 0, s = i is 0 and j is 1, t = both 0.</p>
<table><tr><th>Type</th><th>Dissimilarity</th></tr>
<tr><td><b>Symmetric</b> (both values equally important, e.g. gender)</td><td>d(i, j) = (r + s) / (q + r + s + t)  (simple matching)</td></tr>
<tr><td><b>Asymmetric</b> (rarer value 1 matters, e.g. a positive disease test)</td><td>d(i, j) = (r + s) / (q + r + s)  (Jaccard; t is ignored)</td></tr></table>
<div class="ex"><b>Example.</b> i = (1, 0, 1, 0, 0, 0), j = (1, 0, 1, 0, 1, 1): q = 2, r = 0, s = 2, t = 2. Simple matching = 2/6 = 0.33. Jaccard = 2/4 = 0.50.</div>
<div data-w="bin"></div>
<h2>3. Nominal (categorical) variables</h2>
<p>More than two unordered states (red, green, blue). <b>d(i, j) = (p − m) / p</b>, where m = number of variables with the same state and p = total variables. Alternatively encode each state as a binary variable.</p>
<h2>4. Ordinal variables</h2>
<p>Ordered states (small, medium, large). Replace each value by its rank r<sub>if</sub> ∈ {1 … M<sub>f</sub>}, scale to [0, 1] with <b>z<sub>if</sub> = (r<sub>if</sub> − 1) / (M<sub>f</sub> − 1)</b>, then use an interval-scaled distance.</p>
<h2>5. Ratio-scaled variables</h2>
<p>Positive measurements on a non-linear scale, e.g. exponential growth A·e<sup>Bt</sup>. Apply a <b>logarithm</b> y = log(x) then treat as interval-scaled, or treat the values as continuous ordinal.</p>
<h2>6. Variables of mixed types</h2>
<p>Combine the variables with a weighted formula: <b>d(i, j) = Σ δ<sub>ij</sub><sup>(f)</sup> d<sub>ij</sub><sup>(f)</sup> / Σ δ<sub>ij</sub><sup>(f)</sup></b>, where δ = 0 if a value is missing (or both are 0 for an asymmetric binary variable), else 1, and d<sup>(f)</sup> is computed according to the type of variable f, scaled into [0, 1].</p>`,
    qa: [
      Q(2, 'What is a dissimilarity matrix?', 'An n × n table whose entry d(i, j) is the distance between objects i and j; it is symmetric with zeros on the diagonal.'),
      Q(2, 'Write the Manhattan and Euclidean distance formulas.', 'Manhattan: Σ|x<sub>i</sub> − y<sub>i</sub>|. Euclidean: √Σ(x<sub>i</sub> − y<sub>i</sub>)².'),
      Q(5, 'Explain the dissimilarity measures for binary variables with an example.', 'Contingency table q, r, s, t; simple matching for symmetric; Jaccard for asymmetric; the numeric example above (0.33 and 0.50).'),
      Q(8, 'Explain the types of data in cluster analysis and how to compute dissimilarity for each.', '<p>Data matrix and dissimilarity matrix (1). Interval-scaled with standardisation and Minkowski distances (2). Binary (2). Nominal, ordinal, ratio-scaled (2). Mixed type formula (1).</p>'),
    ],
  },
  {
    id: 'm4-3', mod: 'm4', title: 'Categorization of clustering methods', pr: 'High',
    tags: 'categorization clustering methods partitioning hierarchical density based grid based model based',
    body: `
<table><tr><th>Category</th><th>Idea</th><th>Examples</th><th>Finds</th></tr>
<tr><td><b>Partitioning</b></td><td>Divide n objects into k groups (k given); iteratively relocate objects to improve a criterion such as squared error</td><td>k-means, k-medoids (PAM), CLARA, CLARANS</td><td>Spherical clusters of similar size</td></tr>
<tr><td><b>Hierarchical</b></td><td>Build a tree of clusters by merging (agglomerative) or splitting (divisive)</td><td>AGNES, DIANA, BIRCH, CURE, Chameleon</td><td>Nested clusters at any level</td></tr>
<tr><td><b>Density-based</b></td><td>Grow clusters as long as the neighbourhood density exceeds a threshold</td><td>DBSCAN, OPTICS, DENCLUE</td><td>Arbitrary shapes, noise</td></tr>
<tr><td><b>Grid-based</b></td><td>Quantise the space into a finite number of cells and cluster the cells</td><td>STING, CLIQUE, WaveCluster</td><td>Fast, independent of the number of objects</td></tr>
<tr><td><b>Model-based</b></td><td>Fit a mathematical model to the data and find the best fit</td><td>EM (mixture of Gaussians), COBWEB, SOM</td><td>Probabilistic clusters</td></tr></table>
<h2>Other distinctions</h2>
<ul><li><b>Exclusive versus overlapping</b> (fuzzy) clusters: an object in one cluster or in several with membership degrees.</li><li><b>Distance-based</b> versus <b>density or connectivity-based</b>.</li><li><b>Clustering high-dimensional data</b> (CLIQUE, subspace clustering) and <b>constraint-based</b> clustering.</li></ul>
<div class="tip"><b>Exam tip.</b> Learn the table: category, idea, two example algorithms, one strength. It answers most "categorise" questions.</div>`,
    qa: [
      Q(2, 'List the categories of clustering methods.', 'Partitioning, hierarchical, density-based, grid-based, model-based.'),
      Q(5, 'Briefly describe the major clustering approaches.', 'One paragraph each for the five categories, with the algorithms named in the table.'),
      Q(8, 'Compare partitioning, hierarchical and density-based methods.', '<p>Idea (3), parameters needed (k, linkage, ε and MinPts) (2), cluster shape and noise handling (2), complexity and example (1).</p>'),
    ],
  },
  {
    id: 'm4-4', mod: 'm4', title: 'Partitioning methods: k-means', pr: 'Very High',
    tags: 'k means k medoids pam clara partitioning centroid squared error iteration cluster mean',
    body: `
<div class="def"><b>Partitioning methods</b> divide n objects into k clusters (k ≤ n), each object in exactly one cluster, so that a criterion, usually the sum of squared errors, is minimised. <b>k-means</b> represents each cluster by its <b>centroid</b> (the mean of its points).</div>
<h2>Algorithm</h2>
<ol><li>Choose k objects at random as the <b>initial centroids</b>.</li><li><b>Assign</b> each object to the nearest centroid (smallest Euclidean distance).</li><li><b>Update</b> each centroid to the mean of the objects assigned to it.</li><li>Repeat steps 2 and 3 until the assignments (and so the centroids) <b>no longer change</b>.</li></ol>
<p>The criterion: <b>E = Σ<sub>i=1..k</sub> Σ<sub>p∈C<sub>i</sub></sub> |p − m<sub>i</sub>|²</b>, the sum of squared distances of every object to its cluster mean.</p>
<h2>Worked example</h2>
<p>Data: 2, 4, 10, 12, 3, 20, 30, 11, 25; k = 2; initial centroids m₁ = 2, m₂ = 4.</p>
<pre>Iteration 1: m₁ = 2, m₂ = 4
  C₁ = {2, 3}     C₂ = {4, 10, 12, 20, 30, 11, 25}   (3 is equally close to 2 and 4; a tie goes to the first)
  → m₁ = 2.5, m₂ = 16
Iteration 2: m₁ = 2.5, m₂ = 16
  C₁ = {2, 3, 4}   C₂ = {10, 12, 20, 30, 11, 25}
  → m₁ = 3, m₂ = 18
Iteration 3: m₁ = 3, m₂ = 18
  C₁ = {2, 3, 4, 10}   C₂ = {12, 20, 30, 11, 25}
  → m₁ = 4.75, m₂ = 19.6
Iteration 4: m₁ = 4.75, m₂ = 19.6
  C₁ = {2, 3, 4, 10, 11, 12}   C₂ = {20, 30, 25}
  → m₁ = 7, m₂ = 25
Iteration 5: assignments do not change. Stop.

Final clusters: {2, 3, 4, 10, 11, 12} with mean 7, and {20, 25, 30} with mean 25</pre>
<div data-w="kmeans"></div>
<h2>Strengths and weaknesses</h2>
<ul><li><b>Strengths:</b> simple, fast: O(nkt) for t iterations; works well for compact, well separated, spherical clusters.</li><li><b>Weaknesses:</b> k must be specified; the result depends on the <b>initial centroids</b> and may reach a <b>local optimum</b> (run several times, or use k-means++); only for numeric data (a mean must exist); <b>sensitive to noise and outliers</b> because a mean is pulled by extreme values; poor on non-convex shapes and clusters of very different sizes.</li></ul>
<h2>k-medoids (PAM)</h2>
<p>Uses an actual object, the <b>medoid</b> (most central object), to represent each cluster instead of the mean. Steps: pick k medoids; assign each object to the nearest medoid; try swapping a medoid with a non-medoid, and keep the swap if the total cost (sum of distances) falls; repeat until no swap helps. It is <b>less sensitive to outliers</b> but costs O(k(n − k)²) per iteration, so it is slower. <b>CLARA</b> runs PAM on samples; <b>CLARANS</b> searches a randomised graph of medoid sets.</p>
<h2>k-means versus k-medoids</h2>
<table><tr><th></th><th>k-means</th><th>k-medoids</th></tr>
<tr><td>Representative</td><td>Mean (may not be a real object)</td><td>An actual object (medoid)</td></tr><tr><td>Outliers</td><td>Sensitive</td><td>Robust</td></tr><tr><td>Cost</td><td>Cheap, O(nkt)</td><td>Expensive</td></tr><tr><td>Data</td><td>Numeric only</td><td>Any data with a distance</td></tr></table>`,
    qa: [
      Q(2, 'Write the objective function of k-means.', 'E = Σ<sub>i</sub> Σ<sub>p∈C<sub>i</sub></sub> |p − m<sub>i</sub>|², the sum of squared distances of objects to their cluster means, which k-means minimises.'),
      Q(2, 'Why is k-means sensitive to outliers?', 'A cluster centre is the mean, and a single extreme value pulls the mean far from the bulk of the points.'),
      Q(5, 'Explain the k-means algorithm. List its drawbacks.', 'Four steps, the squared error criterion, then: k must be given, local optimum, numeric data only, outliers, non-convex shapes.'),
      Q(8, 'Cluster {2, 4, 10, 12, 3, 20, 30, 11, 25} into k = 2 using k-means with initial centroids 2 and 4.', '<p>Show each iteration: the assignment and the new means (6). Final clusters {2,3,4,10,11,12} mean 7 and {20,25,30} mean 25 (2).</p>'),
      Q(16, 'Explain partitioning methods: k-means and k-medoids, with an example and a comparison.', '<p>Partitioning idea and criterion (2). k-means algorithm (3). Numerical example (5). k-medoids PAM steps and swap cost (3). Comparison table (2). Strengths and weaknesses (1).</p>'),
    ],
  },
  {
    id: 'm4-5', mod: 'm4', title: 'Hierarchical clustering', pr: 'Very High',
    tags: 'hierarchical clustering agglomerative divisive dendrogram single link complete link average link agnes diana birch cure chameleon',
    body: `
<div class="def"><b>Definition.</b> Hierarchical clustering builds a <b>tree of clusters</b> (a <b>dendrogram</b>) with no need to fix k in advance. Cutting the tree at a chosen level gives a flat clustering.</div>
<ul><li><b>Agglomerative (bottom-up, AGNES):</b> start with each object as its own cluster; repeatedly <b>merge the two closest clusters</b> until one cluster remains.</li><li><b>Divisive (top-down, DIANA):</b> start with all objects in one cluster; repeatedly <b>split</b> the cluster until each object is alone or a stopping condition is met.</li></ul>
<h2>Inter-cluster distance (linkage)</h2>
<table><tr><th>Linkage</th><th>Distance between clusters C<sub>i</sub> and C<sub>j</sub></th><th>Effect</th></tr>
<tr><td><b>Single link</b> (minimum)</td><td>min d(p, q), p ∈ C<sub>i</sub>, q ∈ C<sub>j</sub></td><td>Can follow chains (chaining effect); finds non-elliptical shapes; sensitive to noise</td></tr>
<tr><td><b>Complete link</b> (maximum)</td><td>max d(p, q)</td><td>Compact, similar-sized clusters; sensitive to outliers</td></tr>
<tr><td><b>Average link</b></td><td>average of all d(p, q)</td><td>Compromise</td></tr>
<tr><td><b>Centroid</b></td><td>distance between the cluster means</td><td>Simple, can reverse (inversions)</td></tr></table>
<h2>Agglomerative algorithm</h2>
<ol><li>Compute the proximity (distance) matrix.</li><li>Let each object be a cluster.</li><li>Repeat: merge the two closest clusters; update the distance matrix using the chosen linkage.</li><li>Until a single cluster remains (or the distance exceeds a threshold). Record each merge height for the dendrogram.</li></ol>
<div class="ex"><b>Worked example</b> (single link). Points on a line: A = 1, B = 2, C = 4, D = 5, E = 7. Distances: AB = 1, AC = 3, AD = 4, AE = 6, BC = 2, BD = 3, BE = 5, CD = 1, CE = 3, DE = 2.
<pre>Step 1: smallest distance 1 (AB and CD). Merge A,B → (AB) at height 1
Step 2: merge C,D → (CD) at height 1
Step 3: distances now
   (AB)–(CD) = min(AC=3, AD=4, BC=2, BD=3) = 2
   (AB)–E    = min(AE=6, BE=5) = 5
   (CD)–E    = min(CE=3, DE=2) = 2
   smallest is 2 (a tie); merge (CD) with E → ((CD) E) at height 2
Step 4: (AB)–((CD)E) = min(2, 5, ...) = 2. Merge → all points at height 2

Complete link on the same data: merges at 1, 1, 3 (E joins CD, max(CE=3, DE=2)), then 6.
Average link: merges at 1, 1, 2.5, then 3.83.</pre></div>
<div data-w="hier"></div>
<h2>Dendrogram</h2>
<p>A tree whose leaves are objects and whose joins are drawn at the distance where the clusters merged. Cutting horizontally at a height gives the clusters at that level.</p>
<h2>Advantages and limits</h2>
<p>No k needed, a full hierarchy, any distance measure. But a merge or split <b>cannot be undone</b>, so early mistakes persist; cost is at least O(n²) memory and O(n² log n) time, so it does not scale well.</p>
<h2>Improved methods</h2>
<ul><li><b>BIRCH:</b> a single scan builds a <b>CF-tree</b> of clustering features CF = (N, LS, SS) (count, linear sum, squared sum), then refines the leaves with another clustering. Scales linearly; good for spherical clusters.</li><li><b>CURE:</b> represents each cluster by several well-scattered points shrunk towards the centre, so it finds non-spherical clusters and resists outliers.</li><li><b>Chameleon:</b> dynamic modelling. Builds a k-nearest-neighbour graph, partitions it into small sub-clusters, then merges those that have high relative inter-connectivity and relative closeness.</li></ul>`,
    qa: [
      Q(2, 'What is a dendrogram?', 'A tree diagram that shows the order and distance at which clusters are merged (or split) in hierarchical clustering.'),
      Q(2, 'Differentiate agglomerative and divisive clustering.', 'Agglomerative starts with singletons and merges the closest pair repeatedly (bottom-up); divisive starts with one cluster and splits it repeatedly (top-down).'),
      Q(5, 'Explain single link, complete link and average link.', 'The three formulas with min, max and average, and the effect of each (chaining, compactness).'),
      Q(8, 'Apply single-link agglomerative clustering to A = 1, B = 2, C = 4, D = 5, E = 7 and draw the dendrogram.', '<p>Distance matrix (2). Merges: (AB) at 1, (CD) at 1, E joins at 2, then all at 2 (4). Dendrogram (2).</p>'),
      Q(16, 'Explain hierarchical clustering methods: AGNES, DIANA, linkages, dendrogram, BIRCH, CURE and Chameleon.', '<p>Agglomerative and divisive (3). Linkage table (3). Example with dendrogram (4). Limitations (2). BIRCH with CF-tree, CURE, Chameleon (4).</p>'),
    ],
  },
  {
    id: 'm4-6', mod: 'm4', title: 'Density-based clustering', pr: 'Very High',
    tags: 'density based clustering dbscan optics denclue epsilon minpts core border noise density reachable density connected',
    body: `
<div class="def"><b>Idea.</b> A cluster is a <b>dense region</b> of points separated from other dense regions by low-density regions. Density-based methods find clusters of <b>arbitrary shape</b> and treat sparse points as <b>noise</b>. The main algorithm is <b>DBSCAN</b>.</div>
<h2>DBSCAN definitions</h2>
<p>Two parameters: <b>ε (eps)</b>, the neighbourhood radius, and <b>MinPts</b>, the minimum number of points in a neighbourhood.</p>
<ul><li><b>ε-neighbourhood</b> of p: all points within distance ε of p (including p).</li><li><b>Core point:</b> its ε-neighbourhood has at least MinPts points.</li><li><b>Border point:</b> not a core point, but lies in the ε-neighbourhood of a core point.</li><li><b>Noise (outlier):</b> neither core nor border.</li><li><b>Directly density-reachable:</b> q is directly density-reachable from p if q is in the ε-neighbourhood of p and p is a core point.</li><li><b>Density-reachable:</b> a chain of directly density-reachable points from p to q.</li><li><b>Density-connected:</b> p and q are both density-reachable from some core point o.</li></ul>
<p>A cluster is a maximal set of density-connected points.</p>
<h2>Algorithm</h2>
<ol><li>Mark all points unvisited. Pick an unvisited point p.</li><li>If the ε-neighbourhood of p has fewer than MinPts points, mark p as <b>noise</b> (it may later become a border point).</li><li>Otherwise p is a core point: create a new cluster C and add p and its neighbours.</li><li>For every neighbour that is also a core point, add its neighbours too, and keep expanding until no point can be added.</li><li>Repeat from step 1 until all points are visited.</li></ol>
<div class="ex"><b>Worked example.</b> ε = 1.2, MinPts = 3. P1 (1, 1), P2 (1.5, 2), P3 (2, 1.5), P4 (5, 5), P5 (5.5, 5), P6 (6, 5.5), P7 (10, 1).
<pre>Neighbourhoods (distance ≤ 1.2):
 P1: {P1, P2, P3} = 3 points → core        P2: {P1, P2, P3} → core     P3: {P1, P2, P3} → core
 P4: {P4, P5, P6} = 3 points → core        P5, P6 → core
 P7: {P7} = 1 point → not core, not reachable from any core point → noise
Cluster C1 = {P1, P2, P3}, cluster C2 = {P4, P5, P6}, noise = {P7}</pre></div>
<div data-w="dbscan"></div>
<h2>Strengths and weaknesses</h2>
<ul><li><b>Strengths:</b> no need to give the number of clusters; finds arbitrary shapes; identifies noise; one scan with an index gives O(n log n).</li><li><b>Weaknesses:</b> sensitive to ε and MinPts; cannot handle clusters of <b>very different density</b> with one ε; trouble in high dimensions; border points can belong to either of two clusters.</li></ul>
<h2>Other density-based methods</h2>
<ul><li><b>OPTICS:</b> does not produce one clustering; it creates a <b>cluster ordering</b> with a <b>core distance</b> and <b>reachability distance</b> for each point, from which clusters for a range of ε values can be read (reachability plot). Handles varying density.</li><li><b>DENCLUE:</b> models density with <b>kernel density functions</b> (influence functions, e.g. Gaussian); clusters are the local maxima (density attractors) found by hill climbing. Good mathematical basis, faster than DBSCAN on large data.</li></ul>`,
    qa: [
      Q(2, 'Define core point, border point and noise in DBSCAN.', 'Core: at least MinPts points within ε. Border: fewer than MinPts, but inside a core point\'s neighbourhood. Noise: neither.'),
      Q(2, 'What are the two parameters of DBSCAN?', 'ε (eps), the neighbourhood radius, and MinPts, the minimum number of points required in a neighbourhood for a core point.'),
      Q(5, 'Explain density-reachable and density-connected.', 'Definitions with a chain of directly density-reachable core points, and the common core point for density-connected, with a sketch.'),
      Q(8, 'Explain the DBSCAN algorithm with an example.', '<p>Parameters and point types (2). Algorithm steps (3). Worked example with clusters and noise (3).</p>'),
      Q(16, 'Explain density-based clustering: DBSCAN, OPTICS and DENCLUE, with strengths and weaknesses.', '<p>Density idea (2). DBSCAN definitions (3), algorithm (3), example (3). OPTICS (2). DENCLUE (2). Strengths and weaknesses (1).</p>'),
    ],
  },
  {
    id: 'm4-7', mod: 'm4', title: 'Grid-based clustering', pr: 'High',
    tags: 'grid based clustering sting clique wavecluster cell statistical information subspace',
    body: `
<div class="def"><b>Idea.</b> Quantise the object space into a <b>finite number of cells</b> forming a grid, then cluster the cells instead of the objects. The processing time depends on the <b>number of cells</b>, not on the number of data objects, so it is very fast.</div>
<div data-w="diag:grid"></div>
<h2>STING (Statistical Information Grid)</h2>
<ul><li>The area is divided into <b>rectangular cells</b> in a hierarchy: each cell at a higher level is split into smaller cells at the next level (usually 4).</li><li>Each cell stores <b>statistics</b>: count n, mean, standard deviation, minimum, maximum, and the distribution type.</li><li>Query answering is <b>top-down</b>: start from a high-level layer, keep the cells that are <b>relevant</b> to the query (by their statistics), and go to their children only. Irrelevant cells are discarded.</li><li>Clusters are the regions of relevant cells at the lowest layer that meet the density requirement.</li><li><b>Advantages:</b> query-independent precomputation, parallel and incremental update, O(g) where g = number of lowest-level cells. <b>Limitation:</b> only horizontal or vertical cluster boundaries, so cluster quality depends on grid granularity.</li></ul>
<h2>CLIQUE (Clustering In QUEst)</h2>
<ul><li>A <b>grid-based and density-based subspace</b> clustering method for high-dimensional data.</li><li>Partition every dimension into equal intervals, giving rectangular units; a unit is <b>dense</b> if the fraction of points in it exceeds a threshold.</li><li>Find dense units in 1-D subspaces first, then use the <b>Apriori principle</b> (a dense k-dimensional unit has dense (k−1)-dimensional projections) to find dense units in higher subspaces.</li><li>A cluster is a maximal set of <b>connected dense units</b> in a subspace; each cluster is described by a minimal DNF expression.</li><li><b>Advantages:</b> finds clusters in subspaces automatically, insensitive to input order, scales linearly with the number of objects. <b>Limitation:</b> accuracy depends on the simplicity of the method; the number of clusters can be large.</li></ul>
<h2>WaveCluster</h2>
<p>Applies a <b>wavelet transform</b> to the grid-quantised feature space; the high-frequency parts (cluster edges) are removed and the low-frequency parts (dense regions) remain, so clusters appear as connected components in the transformed space. It removes noise, finds arbitrary shapes and is O(n).</p>
<h2>Summary</h2>
<table><tr><th></th><th>STING</th><th>CLIQUE</th><th>WaveCluster</th></tr>
<tr><td>Core idea</td><td>Hierarchical grid with statistics</td><td>Dense units in subspaces (Apriori)</td><td>Wavelet transform of the grid</td></tr>
<tr><td>Strength</td><td>Fast queries, parallel</td><td>High dimensions</td><td>Arbitrary shape, noise removal</td></tr></table>`,
    qa: [
      Q(2, 'Why are grid-based methods fast?', 'Their cost depends on the number of grid cells, not on the number of data objects.'),
      Q(5, 'Explain the STING clustering method.', 'Hierarchical rectangular cells, statistics stored in each cell, top-down query processing that prunes irrelevant cells, advantages and limitation.'),
      Q(8, 'Explain CLIQUE for high-dimensional data.', '<p>Grid partition and dense units (2). Apriori-style bottom-up subspace search (3). Cluster as connected dense units and DNF description (2). Advantages and limits (1).</p>'),
    ],
  },
  {
    id: 'm4-8', mod: 'm4', title: 'Outlier analysis', pr: 'High',
    tags: 'outlier analysis detection statistical distance based density based lof deviation based global contextual collective z score iqr',
    body: `
<div class="def"><b>Definition.</b> An <b>outlier</b> is a data object that is <b>considerably dissimilar</b> from the rest of the data, as if it were generated by a different mechanism. Outlier detection (anomaly detection, deviation mining) finds these objects. One person's noise can be another's signal: for <b>fraud detection</b> the outlier is the target.</div>
<h2>Types of outliers</h2>
<ul><li><b>Global (point) outlier:</b> deviates from the whole data set (a single 1,00,000 rupee purchase among small ones).</li><li><b>Contextual (conditional) outlier:</b> unusual only in its context: 30°C is normal in summer but an outlier in winter. Contextual attributes (time, place) and behavioural attributes (temperature).</li><li><b>Collective outlier:</b> a <b>group</b> of objects that is unusual together although each object alone may look normal (a long run of identical low values in a heartbeat signal).</li></ul>
<h2>Methods</h2>
<table><tr><th>Approach</th><th>Idea</th><th>Techniques</th></tr>
<tr><td><b>Statistical</b></td><td>Assume a distribution (normal); objects with low probability are outliers</td><td>z-score (|z| &gt; 3), Grubbs test, boxplot (IQR) rule</td></tr>
<tr><td><b>Distance-based</b></td><td>An object is an outlier if few objects are near it: DB(p, D)-outlier if at least fraction p of objects are farther than D</td><td>Nested loop, index-based, cell-based</td></tr>
<tr><td><b>Density-based</b></td><td>Compare local density of a point with its neighbours; <b>Local Outlier Factor (LOF)</b> far above 1 means outlier. Finds outliers near dense clusters</td><td>LOF</td></tr>
<tr><td><b>Deviation-based</b></td><td>Objects that deviate from the main characteristics of a group, using a dissimilarity function and a smoothing factor</td><td>Sequential exception technique, OLAP data cube</td></tr>
<tr><td><b>Clustering-based</b></td><td>An outlier lies far from every cluster centre, or in a tiny cluster, or is noise in DBSCAN</td><td>k-means distance, DBSCAN noise</td></tr>
<tr><td><b>Proximity versus model</b></td><td>Supervised (labelled normal and outlier), semi-supervised, unsupervised</td><td></td></tr></table>
<h2>Statistical rules</h2>
<ul><li><b>z-score:</b> z = (x − mean) / standard deviation; flag |z| &gt; 3 (or 2.5).</li><li><b>IQR rule:</b> Q₁, Q₃, IQR = Q₃ − Q₁; flag values below <b>Q₁ − 1.5 × IQR</b> or above <b>Q₃ + 1.5 × IQR</b>.</li></ul>
<div class="ex"><b>Example.</b> Values 10, 12, 12, 13, 12, 11, 14, 13, 15, 102. Mean 21.4, SD 28.4, so for 102 z = 2.84, which is <b>not</b> beyond 3. IQR rule: Q₁ = 12, Q₃ = 13.75, IQR = 1.75, fences 9.375 and 16.375, so 102 <b>is</b> flagged. The outlier itself inflates the mean and SD (the <b>masking effect</b>), which is why robust rules (IQR, median) are preferred.</div>
<div data-w="out"></div>
<h2>Challenges</h2>
<p>Defining normal is hard, normal and outlier boundaries are fuzzy, handling noise versus outliers, high dimensions, and interpretability (justify why it is an outlier).</p>`,
    qa: [
      Q(2, 'Define an outlier.', 'An object that deviates so much from the other objects that it appears to be generated by a different mechanism.'),
      Q(2, 'Differentiate contextual and collective outliers.', 'A contextual outlier is unusual only in its context (temperature in winter); a collective outlier is a group of objects that is unusual together though each may look normal alone.'),
      Q(5, 'Explain the statistical and distance-based approaches to outlier detection.', 'Statistical: assume a normal distribution, z-score and IQR rules. Distance-based: DB(p, D) outliers, with one example for each.'),
      Q(8, 'Explain the different outlier detection methods.', '<p>Types of outliers (2). Statistical (2). Distance-based (1). Density-based LOF (1). Deviation and clustering-based (2).</p>'),
    ],
  },
  {
    id: 'cmp-1', mod: 'cmp', title: 'Exam comparisons', pr: 'Very High',
    tags: 'comparison compare difference id3 c4.5 cart eager lazy k means k medoids single complete agglomerative divisive dbscan classification clustering',
    body: `
<h2>ID3, C4.5 and CART</h2>
<table><tr><th></th><th>ID3</th><th>C4.5</th><th>CART</th></tr>
<tr><td>Measure</td><td>Information gain</td><td>Gain ratio</td><td>Gini index</td></tr><tr><td>Split</td><td>Multiway</td><td>Multiway</td><td>Binary</td></tr><tr><td>Continuous</td><td>No</td><td>Yes (split point)</td><td>Yes</td></tr><tr><td>Missing values</td><td>No</td><td>Yes</td><td>Yes (surrogate splits)</td></tr><tr><td>Pruning</td><td>No</td><td>Pessimistic</td><td>Cost-complexity</td></tr></table>
<h2>Classification and clustering</h2>
<table><tr><th></th><th>Classification</th><th>Clustering</th></tr><tr><td>Learning</td><td>Supervised</td><td>Unsupervised</td></tr><tr><td>Labels</td><td>Given</td><td>Not given</td></tr><tr><td>Output</td><td>Class of new tuples</td><td>Groups</td></tr></table>
<h2>Eager and lazy learners</h2>
<table><tr><th></th><th>Eager</th><th>Lazy</th></tr><tr><td>Builds a model</td><td>Yes, before queries</td><td>No, at query time</td></tr><tr><td>Prediction speed</td><td>Fast</td><td>Slow</td></tr></table>
<h2>k-means and k-medoids</h2>
<table><tr><th></th><th>k-means</th><th>k-medoids</th></tr><tr><td>Centre</td><td>Mean</td><td>Real object</td></tr><tr><td>Outliers</td><td>Sensitive</td><td>Robust</td></tr><tr><td>Speed</td><td>Fast</td><td>Slow</td></tr></table>
<h2>Agglomerative and divisive</h2>
<table><tr><th></th><th>Agglomerative</th><th>Divisive</th></tr><tr><td>Direction</td><td>Bottom-up (merge)</td><td>Top-down (split)</td></tr><tr><td>Start</td><td>n clusters</td><td>1 cluster</td></tr><tr><td>Cost</td><td>Lower, common</td><td>Higher</td></tr></table>
<h2>k-means and DBSCAN</h2>
<table><tr><th></th><th>k-means</th><th>DBSCAN</th></tr><tr><td>Parameters</td><td>k</td><td>ε and MinPts</td></tr><tr><td>Shape</td><td>Spherical</td><td>Arbitrary</td></tr><tr><td>Noise</td><td>No concept, sensitive</td><td>Detects noise</td></tr><tr><td>Number of clusters</td><td>Given</td><td>Found</td></tr></table>
<h2>Single, complete and average link</h2>
<table><tr><th></th><th>Single</th><th>Complete</th><th>Average</th></tr><tr><td>Distance</td><td>Minimum</td><td>Maximum</td><td>Mean of all pairs</td></tr><tr><td>Weakness</td><td>Chaining</td><td>Sensitive to outliers, breaks large clusters</td><td>Middle ground</td></tr></table>
<h2>Gini and information gain</h2>
<table><tr><th></th><th>Information gain</th><th>Gini index</th></tr><tr><td>Formula</td><td>Entropy reduction</td><td>1 − Σp²</td></tr><tr><td>Bias</td><td>Many-valued attributes</td><td>Equal-sized, pure partitions</td></tr><tr><td>Computation</td><td>log₂ needed</td><td>Cheaper</td></tr></table>
<h2>Precision and recall</h2>
<table><tr><th></th><th>Precision</th><th>Recall</th></tr><tr><td>Formula</td><td>TP/(TP + FP)</td><td>TP/(TP + FN)</td></tr><tr><td>Question</td><td>How many selected are right?</td><td>How many right ones were found?</td></tr></table>`,
    qa: [
      Q(5, 'Compare k-means and DBSCAN.', 'Use the k-means and DBSCAN table above.'),
      Q(5, 'Compare ID3, C4.5 and CART.', 'Use the ID3, C4.5 and CART table above.'),
    ],
  },
];

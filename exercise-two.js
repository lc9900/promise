'use strict';

var Promise = require('bluebird'),
    async = require('async'),
    exerciseUtils = require('./utils');

var readFile = exerciseUtils.readFile,
    promisifiedReadFile = exerciseUtils.promisifiedReadFile,
    blue = exerciseUtils.blue,
    magenta = exerciseUtils.magenta;

var args = process.argv.slice(2).map(function(st){ return st.toUpperCase(); });

module.exports = {
  problemA: problemA,
  problemB: problemB,
  problemC: problemC,
  problemD: problemD,
  problemE: problemE
};

// runs every problem given as command-line argument to process
args.forEach(function(arg){
  var problem = module.exports['problem' + arg];
  if (problem) problem();
});

function problemA () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * A. log poem two stanza one and stanza two, in any order
   *    but log 'done' when both are done
   *    (ignore errors)
   *    note: reads are occurring in parallel (simultaneously)
   *
   */

  // callback version
  // async.each(['poem-two/stanza-01.txt', 'poem-two/stanza-02.txt'],
  //   function (filename, eachDone) {
  //     readFile(filename, function (err, stanza) {
  //       console.log('-- A. callback version --');
  //       blue(stanza);
  //       eachDone();
  //     });
  //   },
  //   function (err) {
  //     console.log('-- A. callback version done --');
  //   }
  // );

  // promise version
  Promise.all([
    promisifiedReadFile('poem-two/stanza-01.txt')
    .then(function(stanza){
      blue(stanza);
    }),
    promisifiedReadFile('poem-two/stanza-02.txt')
    .then(function(stanza){
      blue(stanza);
    })
  ])
  .then(function(){
    console.log('done');
  })

}

function problemB () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * B. log all the stanzas in poem two, in any order
   *    and log 'done' when they're all done
   *    (ignore errors)
   *    note: reads are occurring in parallel (simultaneously)
   *
   */

  var filenames = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
    return 'poem-two/' + 'stanza-0' + n + '.txt';
  });

  // callback version
  // async.each(filenames,
  //   function (filename, eachDone) {
  //     readFile(filename, function (err, stanza) {
  //       console.log('-- B. callback version --');
  //       blue(stanza);
  //       eachDone();
  //     });
  //   },
  //   function (err) {
  //     console.log('-- B. callback version done --');
  //   }
  // );

  // promise version
  Promise.map(filenames,
              function(filename){
                return promisifiedReadFile(filename)
                  .then(function(stanza){
                    blue(stanza);
                  });
              }
  )
  .then(function(){
    console.log('All done');
  });


// Promise.map(fileNames, function(fileName) {
//     // Promise.map awaits for returned promises as well.
//     return fs.readFileAsync(fileName);
// }).then(function() {
//     console.log("done");
// });

}

function problemC () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * C. read & log all the stanzas in poem two, *in order*
   *    and log 'done' when they're all done
   *    (ignore errors)
   *    note: reads are occurring in series (only when previous finishes)
   *
   */

  var filenames = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
    return 'poem-two/' + 'stanza-0' + n + '.txt';
  });

  // callback version
  // async.eachSeries(filenames,
  //   function (filename, eachDone) {
  //     readFile(filename, function (err, stanza) {
  //       console.log('-- C. callback version --');
  //       blue(stanza);
  //       eachDone();
  //     });
  //   },
  //   function (err) {
  //     console.log('-- C. callback version done --');
  //   }
  // );

  // promise version
  // Promise.reduce(filenames,
  //                function(filename){
  //                 return promisifiedReadFile(filename)
  //                         .then(function(stanza){
  //                           blue(stanza);
  //                         });
  //                },
  //               0
  // )
  //   .then(function(){
  //     console.log("All done");
  //   });

  Promise.reduce(filenames,
            function(total, singleFile){
              return promisifiedReadFile(singleFile)
                .then(function(stanza){
                  blue(stanza);
                  return total + 1;
                });
            }, 0
  )
  .then(function(total){
    console.log('All done');
  });

}

function problemD () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * D. log all the stanzas in poem two, *in order*
   *    making sure to fail for any error and log it out
   *    and log 'done' when they're all done
   *    note: reads are occurring in series (only when previous finishes)
   *
   */

  var filenames = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
    return 'poem-two/' + 'stanza-0' + n + '.txt';
  });
  var randIdx = Math.floor(Math.random() * filenames.length);
  filenames[randIdx] = 'wrong-file-name-' + (randIdx + 1) + '.txt';

  // callback version
  // async.eachSeries(filenames,
  //   function (filename, eachDone) {
  //     readFile(filename, function (err, stanza) {
  //       console.log('-- D. callback version --');
  //       if (err) return eachDone(err);
  //       blue(stanza);
  //       eachDone();
  //     });
  //   },
  //   function (err) {
  //     if (err) magenta(err);
  //     console.log('-- D. callback version done --');
  //   }
  // );

  // promise version
   Promise.reduce(filenames,
            function(total, singleFile){
              return promisifiedReadFile(singleFile)
                .then(function(stanza){
                  blue(stanza);
                  return total + 1;
                });
            }, 0
  )
  .then(function(total){
    console.log('All done');
  }, function(err){
    magenta(err);
    console.log("All done with error");
  });

}

function problemE () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * E. make a promisifed version of fs.writeFile
   *
   */

  var fs = require('fs');
  function promisifiedWriteFile (filename, str) {
    // your code here
    return new Promise(function(resolve, reject){
      fs.writeFile(filename, str, function(err){
        if(err) reject(err);
        else resolve(filename);
      });
    });
  }

  // Bad write
  // Requires a nowrite.txt that has no writing rights
  promisifiedWriteFile('nowrite.txt', 'blah')
    .then(function(filename){
      console.log(`${filename} is modifided`);
    })
    .catch(function(err){
      magenta(err);
    });

  // Good write
  promisifiedWriteFile('1.txt', 'Adding to 1.txt\n')
    .then(function(filename){
      console.log(`${filename} is modifided`);
    })
    .catch(function(err){
      magenta(err);
    });
}

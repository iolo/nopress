module.exports = {
    options: {
        devel: true,
        '-W030': true,//Expected an assignment or function call and instead saw an expression.
        '-W097': true//Use the function form of 'use strict'.
    },
    config: {
        options: {
            node: true
        },
        src: ['config/**/*.js']
    },
    lib: {
        options: {
            node: true
        },
        src: ['lib/**/*.js']
    },
    test: {
        options: {
            node: true,
            globals: {
                describe: true,
                it: true,
                before: true,
                after: true,
                beforeEach: true,
                afterEach: true
            }
        },
        src: ['test/**/*.js']
    },
    public: {
        options: {
            browser: true,
            globals: {
                $: true,
                angular: true
            }
        },
        src: ['public/**/*.js']
    }
};

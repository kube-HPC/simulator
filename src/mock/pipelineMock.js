export const pipelineMock = {
  data: {
    pipelines: {
      list: [
        {
          modified: 1745850535169,
          name: 'algorithm-ttl',
          nodes: [
            {
              nodeName: 'evalsleep',
              algorithmName: 'eval-alg',
              input: ['#@flowInput.inp'],
              ttl: 3,
              extraData: {
                code: [
                  '(input,require)=> {',
                  'return  new Promise((resolve,reject)=>{setTimeout(()=>resolve(4),input)});}',
                ],
              },
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          kind: 'batch',
          experimentName: 'main',
          priority: 3,
          version: '5betny7oap',
        },
        {
          modified: 1745389873238,
          name: '7M7SUAMz',
          experimentName: 'main',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'eval-alg',
              input: ['1'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['#@green.0'],
              includeInResults: true,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          flowInput: {
            inp: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
          },
          options: {
            ttl: 800,
            batchTolerance: 60,
            progressVerbosityLevel: 'error',
            concurrentPipelines: {
              amount: 7,
              rejectOnFailure: false,
            },
          },
          priority: 1,
          triggers: {
            pipelines: ['simple2'],
            cron: {
              pattern: '*/1 * * * *',
              enabled: false,
            },
          },
          kind: 'batch',
          version: 'kin6u7vhgx',
        },
        {
          modified: 1739858789871,
          name: 'sub-ein-tst',
          kind: 'stream',
          flowInput: {
            process_time: 0.02,
            flows: [
              {
                name: 'hkube_desc',
                program: [
                  {
                    rate: 1200,
                    time: 50,
                    size: 80,
                  },
                ],
              },
            ],
          },
          streaming: {
            flows: {
              hkube_desc: ' sen-1 >> sen-out-1',
            },
          },
          triggers: {
            cron: {
              enabled: false,
              pattern: '0 * * * *',
            },
            pipelines: [],
          },
          options: {
            batchTolerance: 80,
            concurrentPipelines: {
              amount: 10,
              rejectOnFailure: true,
            },
            ttl: 3600,
            progressVerbosityLevel: 'info',
          },
          priority: 3,
          nodes: [
            {
              stateType: 'stateless',
              nodeName: 'sen-out-1',
              algorithmName: 'stateless-time-statistics-tst',
              minStatelessCount: 0,
              input: [
                {
                  process_time: '@flowInput.process_time',
                },
              ],
              retry: {
                policy: 'Always',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
            },
            {
              stateType: 'stateful',
              nodeName: 'sen-1',
              algorithmName: 'start-streaming-tst',
              input: [
                {
                  flows: '@flowInput.flows',
                },
              ],
              retry: {
                policy: 'Always',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          experimentName: 'main',
          version: 'z1zf2wur93',
        },
        {
          modified: 1732291129526,
          name: 'face-demo',
          kind: 'batch',
          flowInput: {
            url: 'https://scontent.ftlv21-1.fna.fbcdn.net/v/t1.6435-9/50961978_10156801241790102_4088957961286713344_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=f798df&_nc_ohc=xEscaWqn60EQ7kNvgGPkOC9&_nc_zt=23&_nc_ht=scontent.ftlv21-1.fna&_nc_gid=AauuqkFIn15gNMkBgN2pKHy&oh=00_AYBEv_gARosr7AkOhbUx-2DnfPZg0wHwiMClc0oU5Dr6aA&oe=6768139E',
          },
          nodes: [
            {
              nodeName: 'face-crope',
              algorithmName: 'face-detect',
              input: ['@flowInput.url'],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              includeInResult: false,
              metrics: {
                tensorboard: true,
              },
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'draw',
              algorithmName: 'draw-body',
              input: ['#@face-crope'],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              batchOperation: 'indexed',
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'combine',
              algorithmName: 'combined',
              input: ['@draw'],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              batchOperation: 'indexed',
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          triggers: {
            cron: {
              enabled: false,
              pattern: '0 * * * *',
            },
            pipelines: [],
          },
          options: {
            batchTolerance: 80,
            concurrentPipelines: {
              amount: 10,
              rejectOnFailure: true,
            },
            ttl: 3600,
            progressVerbosityLevel: 'info',
          },
          priority: 3,
          experimentName: 'main',
          version: 'o8r1nudncj',
        },
        {
          modified: 1732195964396,
          name: 'problems',
          kind: 'stream',
          streaming: {
            flows: {
              master: 'No_Image>>Lacking_resource>>No_such_Machine',
            },
          },
          triggers: {
            cron: {
              enabled: false,
              pattern: '0 * * * *',
            },
            pipelines: [],
          },
          options: {
            batchTolerance: 80,
            concurrentPipelines: {
              amount: 10,
              rejectOnFailure: true,
            },
            ttl: 3600,
            progressVerbosityLevel: 'info',
          },
          priority: 3,
          nodes: [
            {
              stateType: 'stateful',
              nodeName: 'No_Image',
              algorithmName: 'no-such-image-algo',
              input: [],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              stateType: 'stateful',
              nodeName: 'Lacking_resource',
              algorithmName: 'lacking-resources-algo',
              input: [],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              stateType: 'stateful',
              nodeName: 'No_such_Machine',
              algorithmName: 'node-specific-alg',
              input: [],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          experimentName: 'main',
          version: 'v5jsutddzn',
        },
        {
          modified: 1732192688338,
          name: 'video-demo',
          kind: 'stream',
          flowInput: {
            url: 'https://redirector.googlevideo.com/videoplayback?expire=1726789197&ei=7WHsZqDeIZaYsfIPuLiduAo&ip=209.141.44.95&id=o-ACN9QftVFLORbLf9WGnLEHzzw6di1DEgJ5fUWf1-3LLA&itag=18&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&mh=gU&mm=31%2C29&mn=sn-a5mekn6s%2Csn-a5msen76&ms=au%2Crdu&mv=m&mvi=4&pl=22&initcwndbps=610000&siu=1&vprv=1&svpuc=1&mime=video%2Fmp4&rqh=1&cnr=14&ratebypass=yes&dur=2363.443&lmt=1709014480476349&mt=1726767432&fvip=2&c=ANDROID_TESTSUITE&txp=4438434&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Csiu%2Cvprv%2Csvpuc%2Cmime%2Crqh%2Ccnr%2Cratebypass%2Cdur%2Clmt&sig=AJfQdSswRAIgCEVJ1-OkBFMM_ILIBkdLJD72XIPIkfROdTG5v8ioHxQCID2X47PTvxI1OgHu2lMV3Peh3nsJusYWf4QHvPRImlsb&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=ABPmVW0wRQIhAOMT3llejXeC9N6-By6wUqlleXIRWCELp_EZHOtMW9BRAiBvvmppD9AjZDK44IJCGqdcUyE4lPtDheaS6f-miA3txQ%3D%3D&range=0-',
          },
          streaming: {
            flows: {
              master: ' capture-video >> detect >> combine-detection',
            },
            defaultFlow: 'master',
          },
          triggers: {
            cron: {
              enabled: false,
              pattern: '0 * * * *',
            },
            pipelines: [],
          },
          options: {
            batchTolerance: 80,
            concurrentPipelines: {
              amount: 10,
              rejectOnFailure: true,
            },
            ttl: 3600,
            progressVerbosityLevel: 'info',
          },
          priority: 3,
          nodes: [
            {
              stateType: 'stateful',
              nodeName: 'capture-video',
              algorithmName: 'capture-video',
              input: ['@flowInput.url'],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              stateType: 'stateless',
              nodeName: 'detect',
              algorithmName: 'detection',
              minStatelessCount: 2,
              input: [],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
            },
            {
              stateType: 'stateful',
              nodeName: 'combine-detection',
              algorithmName: 'combine-detection',
              input: [],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          experimentName: 'main',
          version: 'hubxdcdf28',
        },
        {
          modified: 1731916787984,
          name: 'sub-ein',
          kind: 'stream',
          streaming: {
            flows: {
              hkube_desc: ' sen-1 >> sen-out-1',
            },
          },
          triggers: {
            cron: {
              enabled: false,
              pattern: '0 * * * *',
            },
            pipelines: [],
          },
          options: {
            batchTolerance: 80,
            concurrentPipelines: {
              amount: 10,
              rejectOnFailure: true,
            },
            ttl: 3600,
            progressVerbosityLevel: 'info',
          },
          priority: 3,
          nodes: [
            {
              stateType: 'stateless',
              nodeName: 'sen-out-1',
              algorithmName: 'stateless-time-statistics',
              minStatelessCount: 10,
              input: [
                {
                  process_time: 0.02,
                },
              ],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
            },
            {
              stateType: 'stateful',
              nodeName: 'sen-1',
              algorithmName: 'start-streaming',
              input: [
                {
                  flows: [
                    {
                      name: 'hkube_desc',
                      program: [
                        {
                          rate: 120,
                          time: 50,
                          size: 80,
                        },
                      ],
                    },
                  ],
                },
              ],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          experimentName: 'main',
          version: 'vu52nef9yd',
        },
        {
          modified: 1730186072755,
          name: 'ein',
          kind: 'stream',
          streaming: {
            flows: {
              hkube_desc:
                'sen-1 & sen-2 & sen-3 & sen-4 & sen-5>> dete-man>> ag-man>>et-ma-2|ag-man>>aga-al>>et-ma-4|aga-al>>req-man>>et-ma-5|req-man>>sen-out-1&sen-out-2&sen-out-3&sen-out-4&sen-out-5&et-ma-4|syn-man>>iku-man&et-ma-8|iku-man>>iku-al&et-ma-6|iku-al>>et-ma-7-stateless&et-kaf',
              hkube_nav:
                'sen-1 & sen-2 & sen-3 & sen-4 & sen-5>>navi>>ag-man&iku-man&et-ma-3 ',
              hkube_t_res: 'sen-1 & sen-2 & sen-3 & sen-4 & sen-5>>syn-man',
              et_f: 'sen-1 & sen-2 & sen-3 & sen-4 & sen-5 >>et-ma-1',
            },
            defaultFlow: 'hkube_desc',
          },
          triggers: {
            cron: {
              enabled: false,
              pattern: '0 * * * *',
            },
            pipelines: [],
          },
          options: {
            batchTolerance: 80,
            concurrentPipelines: {
              amount: 10,
              rejectOnFailure: true,
            },
            ttl: 3600,
            progressVerbosityLevel: 'info',
          },
          priority: 3,
          nodes: [
            {
              stateType: 'stateful',
              nodeName: 'sen-1',
              algorithmName: 'start-streaming',
              input: [
                {
                  flows: [
                    {
                      name: 'hkube_desc',
                      program: [
                        {
                          rate: 5,
                          time: 120,
                          size: 80,
                        },
                        {
                          rate: 0,
                          time: 120,
                          size: 80,
                        },
                        {
                          rate: 5,
                          time: 120,
                          size: 80,
                        },
                      ],
                    },
                    {
                      name: 'hkube_t_res',
                      program: [
                        {
                          rate: 5,
                          time: 120,
                          size: 80,
                        },
                        {
                          rate: 0,
                          time: 120,
                          size: 80,
                        },
                        {
                          rate: 5,
                          time: 120,
                          size: 80,
                        },
                      ],
                    },
                    {
                      name: 'hkube_nav',
                      program: [
                        {
                          rate: 1,
                          time: 120,
                          size: 80,
                        },
                        {
                          rate: 0,
                          time: 120,
                          size: 80,
                        },
                        {
                          rate: 1,
                          time: 120,
                          size: 80,
                        },
                      ],
                    },
                    {
                      name: 'et_f',
                      program: [
                        {
                          rate: 20,
                          time: 120,
                          size: 80,
                        },
                        {
                          rate: 0,
                          time: 120,
                          size: 80,
                        },
                        {
                          rate: 20,
                          time: 120,
                          size: 80,
                        },
                      ],
                    },
                  ],
                },
              ],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              stateType: 'stateful',
              nodeName: 'sen-2',
              algorithmName: 'start-streaming',
              input: [
                {
                  flows: [
                    {
                      name: 'hkube_desc',
                      program: [
                        {
                          rate: 5,
                          time: 120,
                          size: 80,
                        },
                        {
                          rate: 0,
                          time: 120,
                          size: 80,
                        },
                        {
                          rate: 5,
                          time: 120,
                          size: 80,
                        },
                      ],
                    },
                    {
                      name: 'hkube_t_res',
                      program: [
                        {
                          rate: 5,
                          time: 120,
                          size: 80,
                        },
                        {
                          rate: 0,
                          time: 120,
                          size: 80,
                        },
                        {
                          rate: 5,
                          time: 120,
                          size: 80,
                        },
                      ],
                    },
                    {
                      name: 'hkube_nav',
                      program: [
                        {
                          rate: 1,
                          time: 120,
                          size: 80,
                        },
                        {
                          rate: 0,
                          time: 120,
                          size: 80,
                        },
                        {
                          rate: 1,
                          time: 120,
                          size: 80,
                        },
                      ],
                    },
                    {
                      name: 'et_f',
                      program: [
                        {
                          rate: 20,
                          time: 120,
                          size: 80,
                        },
                        {
                          rate: 0,
                          time: 120,
                          size: 80,
                        },
                        {
                          rate: 20,
                          time: 120,
                          size: 80,
                        },
                      ],
                    },
                  ],
                },
              ],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              stateType: 'stateful',
              nodeName: 'sen-3',
              algorithmName: 'start-streaming',
              input: [
                {
                  flows: [
                    {
                      name: 'hkube_desc',
                      program: [
                        {
                          rate: 5,
                          time: 120,
                          size: 80,
                        },
                        {
                          rate: 0,
                          time: 120,
                          size: 80,
                        },
                        {
                          rate: 5,
                          time: 120,
                          size: 80,
                        },
                      ],
                    },
                    {
                      name: 'hkube_t_res',
                      program: [
                        {
                          rate: 5,
                          time: 120,
                          size: 80,
                        },
                        {
                          rate: 0,
                          time: 120,
                          size: 80,
                        },
                        {
                          rate: 5,
                          time: 120,
                          size: 80,
                        },
                      ],
                    },
                    {
                      name: 'hkube_nav',
                      program: [
                        {
                          rate: 1,
                          time: 120,
                          size: 80,
                        },
                        {
                          rate: 0,
                          time: 120,
                          size: 80,
                        },
                        {
                          rate: 1,
                          time: 120,
                          size: 80,
                        },
                      ],
                    },
                    {
                      name: 'et_f',
                      program: [
                        {
                          rate: 20,
                          time: 120,
                          size: 80,
                        },
                        {
                          rate: 0,
                          time: 120,
                          size: 80,
                        },
                        {
                          rate: 20,
                          time: 120,
                          size: 80,
                        },
                      ],
                    },
                  ],
                },
              ],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              stateType: 'stateful',
              nodeName: 'sen-4',
              algorithmName: 'start-streaming',
              input: [
                {
                  flows: [
                    {
                      name: 'hkube_desc',
                      program: [
                        {
                          rate: 5,
                          time: 120,
                          size: 80,
                        },
                        {
                          rate: 0,
                          time: 120,
                          size: 80,
                        },
                        {
                          rate: 5,
                          time: 120,
                          size: 80,
                        },
                      ],
                    },
                    {
                      name: 'hkube_t_res',
                      program: [
                        {
                          rate: 5,
                          time: 120,
                          size: 80,
                        },
                        {
                          rate: 0,
                          time: 120,
                          size: 80,
                        },
                        {
                          rate: 5,
                          time: 120,
                          size: 80,
                        },
                      ],
                    },
                    {
                      name: 'hkube_nav',
                      program: [
                        {
                          rate: 1,
                          time: 120,
                          size: 80,
                        },
                        {
                          rate: 0,
                          time: 120,
                          size: 80,
                        },
                        {
                          rate: 1,
                          time: 120,
                          size: 80,
                        },
                      ],
                    },
                    {
                      name: 'et_f',
                      program: [
                        {
                          rate: 20,
                          time: 120,
                          size: 80,
                        },
                        {
                          rate: 0,
                          time: 120,
                          size: 80,
                        },
                        {
                          rate: 20,
                          time: 120,
                          size: 80,
                        },
                      ],
                    },
                  ],
                },
              ],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              stateType: 'stateful',
              nodeName: 'sen-5',
              algorithmName: 'start-streaming',
              input: [
                {
                  flows: [
                    {
                      name: 'hkube_desc',
                      program: [
                        {
                          rate: 5,
                          time: 120,
                          size: 80,
                        },
                        {
                          rate: 0,
                          time: 120,
                          size: 80,
                        },
                        {
                          rate: 5,
                          time: 120,
                          size: 80,
                        },
                      ],
                    },
                    {
                      name: 'hkube_t_res',
                      program: [
                        {
                          rate: 5,
                          time: 120,
                          size: 80,
                        },
                        {
                          rate: 0,
                          time: 120,
                          size: 80,
                        },
                        {
                          rate: 5,
                          time: 120,
                          size: 80,
                        },
                      ],
                    },
                    {
                      name: 'hkube_nav',
                      program: [
                        {
                          rate: 1,
                          time: 120,
                          size: 80,
                        },
                        {
                          rate: 0,
                          time: 120,
                          size: 80,
                        },
                        {
                          rate: 1,
                          time: 120,
                          size: 80,
                        },
                      ],
                    },
                    {
                      name: 'et_f',
                      program: [
                        {
                          rate: 20,
                          time: 120,
                          size: 80,
                        },
                        {
                          rate: 0,
                          time: 120,
                          size: 80,
                        },
                        {
                          rate: 20,
                          time: 120,
                          size: 80,
                        },
                      ],
                    },
                  ],
                },
              ],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              stateType: 'stateless',
              nodeName: 'sen-out-1',
              algorithmName: 'stateless-time-statistics',
              minStatelessCount: 0,
              input: [],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
            },
            {
              stateType: 'stateless',
              nodeName: 'sen-out-2',
              algorithmName: 'stateless-time-statistics',
              minStatelessCount: 0,
              input: [],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
            },
            {
              stateType: 'stateless',
              nodeName: 'sen-out-3',
              algorithmName: 'stateless-time-statistics',
              minStatelessCount: 0,
              input: [],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
            },
            {
              stateType: 'stateless',
              nodeName: 'sen-out-4',
              algorithmName: 'stateless-time-statistics',
              minStatelessCount: 0,
              input: [],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
            },
            {
              stateType: 'stateless',
              nodeName: 'sen-out-5',
              algorithmName: 'stateless-time-statistics',
              minStatelessCount: 0,
              input: [],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
            },
            {
              stateType: 'stateful',
              nodeName: 'ag-man',
              algorithmName: 'start-streaming',
              input: [
                {
                  flows: [
                    {
                      name: 'hkube_desc',
                      program: [
                        {
                          rate: 5,
                          time: 120,
                          size: 80,
                          process_time: 4,
                        },
                        {
                          rate: 0,
                          time: 120,
                          size: 80,
                          process_time: 4,
                        },
                        {
                          rate: 5,
                          time: 120,
                          size: 80,
                          process_time: 4,
                        },
                      ],
                    },
                  ],
                },
              ],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              stateType: 'stateless',
              nodeName: 'navi',
              algorithmName: 'stateless-time-statistics',
              minStatelessCount: 0,
              maxStatelessCount: 0,
              input: [],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
            },
            {
              stateType: 'stateful',
              nodeName: 'dete-man',
              algorithmName: 'start-streaming',
              input: [
                {
                  flows: [
                    {
                      name: 'hkube_desc',
                      program: [
                        {
                          rate: 100,
                          time: 120,
                          size: 80,
                        },
                        {
                          rate: 0,
                          time: 120,
                          size: 80,
                        },
                        {
                          rate: 100,
                          time: 120,
                          size: 80,
                        },
                      ],
                    },
                  ],
                },
              ],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              stateType: 'stateless',
              nodeName: 'aga-al',
              algorithmName: 'stateless-time-statistics',
              minStatelessCount: 3,
              input: [
                {
                  process_time: 0.05,
                },
              ],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
            },
            {
              stateType: 'stateful',
              nodeName: 'req-man',
              algorithmName: 'start-streaming',
              input: [
                {
                  flows: [
                    {
                      name: 'hkube_desc',
                      program: [
                        {
                          rate: 50,
                          time: 120,
                          size: 80,
                        },
                        {
                          rate: 0,
                          time: 120,
                          size: 80,
                        },
                        {
                          rate: 50,
                          time: 120,
                          size: 80,
                        },
                      ],
                    },
                  ],
                },
              ],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              stateType: 'stateful',
              nodeName: 'syn-man',
              algorithmName: 'start-streaming',
              input: [
                {
                  flows: [
                    {
                      name: 'hkube_desc',
                      program: [
                        {
                          rate: 70,
                          time: 120,
                          size: 80,
                        },
                        {
                          rate: 0,
                          time: 120,
                          size: 80,
                        },
                        {
                          rate: 70,
                          time: 120,
                          size: 80,
                        },
                      ],
                    },
                  ],
                },
              ],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              stateType: 'stateful',
              nodeName: 'iku-man',
              algorithmName: 'start-streaming',
              input: [
                {
                  flows: [
                    {
                      name: 'hkube_desc',
                      program: [
                        {
                          rate: 70,
                          time: 120,
                          size: 80,
                        },
                        {
                          rate: 0,
                          time: 120,
                          size: 80,
                        },
                        {
                          rate: 70,
                          time: 120,
                          size: 80,
                        },
                      ],
                    },
                  ],
                },
              ],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              stateType: 'stateless',
              nodeName: 'et-kaf',
              algorithmName: 'stateless-time-statistics',
              minStatelessCount: 0,
              maxStatelessCount: 0,
              input: [
                {
                  flows: [
                    {
                      name: 'hkube_t_res',
                      program: [
                        {
                          rate: 50,
                          time: 120,
                          size: 80,
                        },
                        {
                          rate: 0,
                          time: 120,
                          size: 80,
                        },
                        {
                          rate: 50,
                          time: 120,
                          size: 80,
                        },
                      ],
                    },
                  ],
                },
              ],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
            },
            {
              stateType: 'stateful',
              nodeName: 'et-ma-8',
              algorithmName: 'statefull-time-statistics',
              input: [],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              stateType: 'stateful',
              nodeName: 'et-ma-1',
              algorithmName: 'statefull-time-statistics',
              input: [],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              stateType: 'stateful',
              nodeName: 'et-ma-2',
              algorithmName: 'statefull-time-statistics',
              input: [],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              stateType: 'stateful',
              nodeName: 'et-ma-3',
              algorithmName: 'statefull-time-statistics',
              input: [],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              stateType: 'stateful',
              nodeName: 'et-ma-4',
              algorithmName: 'statefull-time-statistics',
              input: [],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              stateType: 'stateful',
              nodeName: 'et-ma-5',
              algorithmName: 'statefull-time-statistics',
              input: [],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              stateType: 'stateful',
              nodeName: 'et-ma-6',
              algorithmName: 'statefull-time-statistics',
              input: [],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              stateType: 'stateless',
              nodeName: 'et-ma-7-stateless',
              algorithmName: 'stateless-time-statistics',
              minStatelessCount: 3,
              maxStatelessCount: 10,
              input: [],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
            },
            {
              stateType: 'stateless',
              nodeName: 'iku-al',
              algorithmName: 'stateless-time-statistics',
              minStatelessCount: 5,
              input: [
                {
                  process_time: 0.2,
                },
              ],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
            },
          ],
          experimentName: 'main',
        },
        {
          modified: 1728222828532,
          name: 'versatile-pipe',
          nodes: [
            {
              nodeName: 'versatile',
              algorithmName: 'versatile',
              input: ['@flowInput.inp'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          kind: 'batch',
          experimentName: 'main',
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          priority: 3,
          version: '23b7g3pqyh',
        },
        {
          modified: 1728222139895,
          name: 'bool',
          nodes: [
            {
              nodeName: 'trueFalse',
              algorithmName: 'eval-alg',
              input: ['@flowInput.inputs'],
              extraData: {
                code: [
                  '(input,require)=> {',
                  'const txt = input[0];',
                  'return txt;}',
                ],
              },
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          kind: 'batch',
          experimentName: 'main',
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          priority: 3,
          version: 'riex5ak7l3',
        },
        {
          modified: 1728222135332,
          name: 'stringReplace',
          nodes: [
            {
              nodeName: 'replace',
              algorithmName: 'eval-alg',
              input: ['@flowInput.inputs'],
              extraData: {
                code: [
                  '(input,require)=> {',
                  'const txt = input[0][0];',
                  'const wToChange = input[0][1];',
                  'const toChange = input [0][2];',
                  'const result = txt.replace(wToChange,toChange);',
                  'return result;}',
                ],
              },
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          kind: 'batch',
          experimentName: 'main',
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          priority: 3,
          version: 'm2p2tdj9t0',
        },
        {
          modified: 1728222133748,
          name: 'addmult',
          nodes: [
            {
              nodeName: 'evaladd',
              algorithmName: 'eval-alg',
              input: ['@flowInput.addInput'],
              extraData: {
                code: ['(input) => {\n    return input[0][0] + input[0][1]\n}'],
              },
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'evalmul',
              algorithmName: 'eval-alg',
              input: ['@evaladd', '@flowInput.multInput'],
              extraData: {
                code: ['(input) => {\n\n    return input[0] * input[1][0]\n}'],
              },
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          kind: 'batch',
          experimentName: 'main',
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          priority: 3,
          version: 'uk1d9ij7w5',
        },
        {
          modified: 1728222074106,
          name: 'singel-on-batch',
          nodes: [
            {
              nodeName: 'eval1',
              algorithmName: 'eval-alg',
              input: ['@flowInput.range'],
              extraData: {
                code: [
                  '(input) => {',
                  'const range = Array.from(Array(input[0]).keys());',
                  'return range }',
                ],
              },
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'two',
              algorithmName: 'green-alg',
              input: ['#@eval1'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'evalsleep',
              algorithmName: 'eval-alg',
              input: ['@flowInput.inputs'],
              extraData: {
                code: [
                  '(input,require)=> {',
                  'return new Promise((resolve,reject)=>{setTimeout(()=>resolve(4),input[0])});}',
                ],
              },
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'three',
              algorithmName: 'yellow-alg',
              input: ['@evalsleep', '@two'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          kind: 'batch',
          experimentName: 'main',
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          priority: 3,
          version: '5i7zyqgigc',
        },
        {
          modified: 1728222061494,
          name: 'simple-batch',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'eval-alg',
              kind: 'algorithm',
              input: [],
              includeInResults: true,
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['@green', '#@flowInput.inp'],
              includeInResults: true,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          kind: 'batch',
          experimentName: 'main',
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          priority: 3,
          version: '03pc1wero1',
        },
        {
          modified: 1728221746373,
          name: 'output-pipeline',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'green-alg',
              input: ['@flowInput.a'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['@flowInput.b', '@green'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@flowInput.c', '@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'output',
              kind: 'output',
              input: ['@yellow', '@green'],
              minStatelessCount: 0,
            },
          ],
          kind: 'batch',
          experimentName: 'main',
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          priority: 3,
          version: 'wtjkpwivn9',
        },
        {
          modified: 1728219695202,
          name: 'pipe-priority12',
          nodes: [
            {
              nodeName: 'eval1',
              algorithmName: 'eval-alg',
              input: ['@flowInput.range'],
              extraData: {
                code: [
                  '(input) => {',
                  'const range = Array.from(Array(input[0]).keys());',
                  'return range }',
                ],
              },
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'evalsleep',
              algorithmName: 'eval-alg',
              input: ['#@eval1', '@flowInput.inputs'],
              extraData: {
                code: [
                  '(input,require)=> {',
                  'return new Promise((resolve,reject)=>{setTimeout(()=>resolve(4),input[1])});}',
                ],
              },
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          kind: 'batch',
          experimentName: 'main',
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          priority: 3,
          version: '8x0ruy7iur',
        },
        {
          modified: 1728219412178,
          name: 'pipe-priority1',
          nodes: [
            {
              nodeName: 'eval1',
              algorithmName: 'eval-alg',
              input: ['@flowInput.range'],
              extraData: {
                code: [
                  '(input) => {',
                  'const range = Array.from(Array(input[0]).keys());',
                  'return range }',
                ],
              },
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'evalsleep',
              algorithmName: 'eval-alg',
              input: ['#@eval1', '@flowInput.inputs'],
              extraData: {
                code: [
                  '(input,require)=> {',
                  'return new Promise((resolve,reject)=>{setTimeout(()=>resolve(30),input[1])});}',
                ],
              },
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            concurrentPipelines: {
              amount: 25,
              rejectOnFailure: false,
            },
            progressVerbosityLevel: 'info',
            ttl: 3600,
            batchTolerance: 80,
          },
          webhooks: {
            progress: 'http://54.195.234.52:3000/webhook/testWebhook',
            result: 'http://54.195.234.52:3000/webhook/testWebhook',
          },
          priority: 1,
          kind: 'batch',
          experimentName: 'main',
          version: 'ig75j3z1j9',
        },
        {
          modified: 1728219220361,
          name: 'pipe-priority3',
          nodes: [
            {
              nodeName: 'eval1',
              algorithmName: 'eval-alg',
              input: ['@flowInput.range'],
              extraData: {
                code: [
                  '(input) => {',
                  'const range = Array.from(Array(input[0]).keys());',
                  'return range }',
                ],
              },
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'evalsleep',
              algorithmName: 'eval-alg',
              input: ['#@eval1', '@flowInput.inputs'],
              extraData: {
                code: [
                  '(input,require)=> {',
                  'return new Promise((resolve,reject)=>{setTimeout(()=>resolve(30),input[1])});}',
                ],
              },
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            concurrentPipelines: {
              amount: 25,
              rejectOnFailure: false,
            },
            progressVerbosityLevel: 'info',
            ttl: 3600,
            batchTolerance: 80,
          },
          webhooks: {
            progress: 'http://54.195.234.52:3000/webhook/testWebhook',
            result: 'http://54.195.234.52:3000/webhook/testWebhook',
          },
          priority: 3,
          kind: 'batch',
          experimentName: 'main',
          version: 'frx9v8t7vb',
        },
        {
          modified: 1728219201126,
          name: 'hRQDZq1C',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'eval-alg',
              input: ['[1,2]'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['#@green.0'],
              includeInResults: false,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          triggers: {
            pipelines: ['rZXbZ5s8'],
          },
          kind: 'batch',
          experimentName: 'main',
          priority: 3,
          version: 'u6d2avswea',
        },
        {
          modified: 1728219057774,
          name: 'ttlPipe',
          nodes: [
            {
              nodeName: 'evalsleep',
              algorithmName: 'eval-alg',
              input: ['#@flowInput.inputs'],
              extraData: {
                code: [
                  '(input,require)=> {',
                  'return new Promise((resolve,reject)=>{setTimeout(()=>resolve(42),input[0])});}',
                ],
              },
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            concurrentPipelines: {
              amount: 1,
              rejectOnFailure: false,
            },
            ttl: 30,
            activeTtl: 25,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          kind: 'batch',
          experimentName: 'main',
          priority: 3,
          version: 'qo6scglonz',
        },
        {
          modified: 1728218933556,
          name: 'pasueResumePipe',
          nodes: [
            {
              nodeName: 'eval1',
              algorithmName: 'eval-alg',
              input: ['@flowInput.range'],
              extraData: {
                code: [
                  '(input) => {',
                  'const range = Array.from(Array(input[0]).keys());',
                  'return range }',
                ],
              },
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'firstbatch',
              algorithmName: 'eval-alg',
              input: ['#@eval1', '@flowInput.inputs'],
              extraData: {
                code: [
                  '(input,require)=> {',
                  'return new Promise((resolve,reject)=>{setTimeout(()=>resolve(4),input[1])});}',
                ],
              },
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'secondbatch',
              algorithmName: 'eval-alg',
              input: ['#@eval1', '@flowInput.inputs', '#@firstbatch'],
              extraData: {
                code: [
                  '(input,require)=> {',
                  'return new Promise((resolve,reject)=>{setTimeout(()=>resolve(4),input[1])});}',
                ],
              },
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          kind: 'batch',
          experimentName: 'main',
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          priority: 3,
          version: '5lp8oyvet2',
        },
        {
          modified: 1728218850954,
          name: 'trigger',
          nodes: [
            {
              nodeName: 'evaladd20',
              algorithmName: 'eval-alg',
              input: ['#@flowInput.addInput'],
              extraData: {
                code: [
                  '(input,require)=> {',
                  'const result = Number(input[0])+20',
                  'return result;}',
                ],
              },
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          kind: 'batch',
          experimentName: 'main',
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          priority: 3,
          version: 'h1yhjv1q9p',
        },
        {
          modified: 1728218822353,
          name: '2oblrAFS',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'eval-alg',
              input: ['#@flowInput.inp'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['#@green.0'],
              includeInResults: false,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          triggers: {
            pipelines: ['simple2'],
          },
          kind: 'batch',
          experimentName: 'main',
          priority: 3,
          version: 'f330ecikak',
        },
        {
          modified: 1728218582554,
          name: '3XR48i73',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'eval-alg',
              input: ['jnk'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['#@green.0'],
              includeInResults: false,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          triggers: {
            pipelines: ['simple2'],
          },
          kind: 'batch',
          experimentName: 'main',
          priority: 3,
          version: '26xogkx2ng',
        },
        {
          modified: 1728218563784,
          name: 'pausePipe',
          nodes: [
            {
              nodeName: 'evalsleep',
              algorithmName: 'eval-alg',
              input: ['#@flowInput.inputs'],
              extraData: {
                code: [
                  '(input,require)=> {',
                  'return new Promise((resolve,reject)=>{setTimeout(()=>resolve(input[0][1]),input[0][0])});}',
                ],
              },
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          flowInput: {
            inputs: [[15000, 1]],
          },
          kind: 'batch',
          experimentName: 'main',
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          priority: 3,
          version: 'l05knjngn1',
        },
        {
          modified: 1726666244099,
          name: 'ebdylnmq',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'green-alg',
              input: ['@flowInput.files.link'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['@green'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          flowInput: {
            files: {
              link: 'links-1',
            },
          },
          options: {
            batchTolerance: 100,
            progressVerbosityLevel: 'debug',
            ttl: 3600,
          },
          experimentName: 'main',
          priority: 3,
          kind: 'batch',
        },
        {
          modified: 1726482704820,
          name: 'DropPipeSingel',
          nodes: [
            {
              nodeName: 'evalsleep',
              algorithmName: 'eval-alg',
              input: ['@flowInput.inp'],
              extraData: {
                code: [
                  '(input,require)=> {',
                  'return  new Promise((resolve,reject)=>{setTimeout(()=>resolve(4),input)});}',
                ],
              },
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'algo-test',
              algorithmName: 'eval-alg',
              input: ['@evalsleep', '@flowInput.inp'],
              metrics: {
                tensorboard: true,
              },
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          kind: 'batch',
          experimentName: 'main',
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          priority: 3,
        },
        {
          modified: 1726473635043,
          name: 'Z9nr2ADL',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'eval-alg',
              input: ['[1,2]'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['#@green.0'],
              includeInResults: false,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          triggers: {
            pipelines: ['hio2LiJP'],
          },
          kind: 'batch',
          experimentName: 'main',
          priority: 3,
        },
        {
          modified: 1726473631767,
          name: 'sg4sfEdR',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'eval-alg',
              input: ['#@flowInput.inp'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['#@green.0'],
              includeInResults: false,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          triggers: {
            pipelines: ['6XFfRqSN'],
          },
          kind: 'batch',
          experimentName: 'main',
          priority: 3,
        },
        {
          modified: 1726473270376,
          name: '6XFfRqSN',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'eval-alg',
              input: ['#@flowInput.inp'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['#@green.0'],
              includeInResults: false,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          triggers: {
            pipelines: ['simple2'],
          },
          kind: 'batch',
          experimentName: 'main',
          priority: 3,
        },
        {
          modified: 1726473030848,
          name: 'HfkNacTK',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'eval-alg',
              input: ['jnk'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['#@green.0'],
              includeInResults: false,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          triggers: {
            pipelines: ['simple2'],
          },
          kind: 'batch',
          experimentName: 'main',
          priority: 3,
        },
        {
          modified: 1726469852093,
          name: 'sync-dev-folderg3o0gxaf',
          nodes: [
            {
              nodeName: 'devFolder',
              algorithmName: 'sync-dev-folderg3o0gxaf',
              input: [
                {
                  devFolder: '/somePath',
                },
              ],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          kind: 'batch',
          experimentName: 'main',
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          priority: 3,
        },
        {
          modified: 1726464500124,
          name: 'dropPipeBatchOnBatch',
          nodes: [
            {
              nodeName: 'eval1',
              algorithmName: 'eval-alg',
              input: ['@flowInput.range'],
              extraData: {
                code: [
                  '(input) => {',
                  'const range = Array.from(Array(input[0]).keys());',
                  'return range }',
                ],
              },
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'firstbatch',
              algorithmName: 'eval-alg',
              input: ['#@eval1', '@flowInput.inputs'],
              extraData: {
                code: [
                  '(input,require)=> {',
                  'return new Promise((resolve,reject)=>{setTimeout(()=>resolve(4),input[1])});}',
                ],
              },
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'secondbatch',
              algorithmName: 'eval-alg',
              input: ['#@eval1', '@flowInput.inputs', '#@firstbatch'],
              extraData: {
                code: [
                  '(input,require)=> {',
                  'return new Promise((resolve,reject)=>{setTimeout(()=>resolve(4),input[1])});}',
                ],
              },
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'thirdbatch',
              algorithmName: 'eval-alg',
              input: ['#@eval1', '@flowInput.inputs', '#@secondbatch'],
              extraData: {
                code: [
                  '(input,require)=> {',
                  'return new Promise((resolve,reject)=>{setTimeout(()=>resolve(4),input[1])});}',
                ],
              },
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          kind: 'batch',
          experimentName: 'main',
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          priority: 3,
        },
        {
          modified: 1726464365703,
          name: 'dropPipeBatch',
          nodes: [
            {
              nodeName: 'eval1',
              algorithmName: 'eval-alg',
              input: ['@flowInput.range'],
              extraData: {
                code: [
                  '(input) => {',
                  'const range = Array.from(Array(input[0]).keys());',
                  'return range }',
                ],
              },
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'firstbatch',
              algorithmName: 'eval-alg',
              input: ['#@eval1', '@flowInput.inputs'],
              extraData: {
                code: [
                  '(input,require)=> {',
                  'return new Promise((resolve,reject)=>{setTimeout(()=>resolve(4),input[1])});}',
                ],
              },
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'secondbatch',
              algorithmName: 'eval-alg',
              input: ['#@eval1', '@flowInput.inputs', '#@firstbatch'],
              extraData: {
                code: [
                  '(input,require)=> {',
                  'return new Promise((resolve,reject)=>{setTimeout(()=>resolve(4),input[1])});}',
                ],
              },
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          kind: 'batch',
          experimentName: 'main',
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          priority: 3,
        },
        {
          modified: 1726404125860,
          name: 'Tc096v1w',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'eval-alg',
              input: ['[1,2]'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['#@green.0'],
              includeInResults: false,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          triggers: {
            pipelines: ['aWeMLcwn'],
          },
          kind: 'batch',
          experimentName: 'main',
          priority: 3,
        },
        {
          modified: 1726404122633,
          name: 'qr0aokNa',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'eval-alg',
              input: ['#@flowInput.inp'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['#@green.0'],
              includeInResults: false,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          triggers: {
            pipelines: ['loqu8J62'],
          },
          kind: 'batch',
          experimentName: 'main',
          priority: 3,
        },
        {
          modified: 1726403763007,
          name: 'loqu8J62',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'eval-alg',
              input: ['#@flowInput.inp'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['#@green.0'],
              includeInResults: false,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          triggers: {
            pipelines: ['simple2'],
          },
          kind: 'batch',
          experimentName: 'main',
          priority: 3,
        },
        {
          modified: 1726403523582,
          name: '5Ai7EcrY',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'eval-alg',
              input: ['jnk'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['#@green.0'],
              includeInResults: false,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          triggers: {
            pipelines: ['simple2'],
          },
          kind: 'batch',
          experimentName: 'main',
          priority: 3,
        },
        {
          modified: 1726402955104,
          name: 'zwcN6neV',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'eval-alg',
              input: ['flowInput.inp'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['#@green'],
              includeInResults: true,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          triggers: {
            pipelines: [],
          },
          kind: 'batch',
          experimentName: 'main',
          priority: 3,
        },
        {
          modified: 1725776887908,
          name: 'streaming-dynamic',
          kind: 'stream',
          flowInput: {
            firstStep: 5000,
            secondStep: 6500,
            delay: 0.0033,
          },
          streaming: {
            flows: {
              analyze: 'A >> B&D',
            },
          },
          options: {
            batchTolerance: 80,
            ttl: 3600,
            progressVerbosityLevel: 'info',
          },
          priority: 3,
          nodes: [
            {
              stateType: 'stateful',
              nodeName: 'A',
              algorithmName: 'slowdown-andstop',
              input: [
                {
                  firstStep: '@flowInput.firstStep',
                  secondStep: '@flowInput.secondStep',
                },
              ],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              stateType: 'stateless',
              nodeName: 'B',
              algorithmName: 'stream-alg',
              minStatelessCount: 0,
              input: [
                {
                  delay: '@flowInput.delay',
                },
              ],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
            },
            {
              stateType: 'stateless',
              nodeName: 'D',
              algorithmName: 'stream-alg',
              minStatelessCount: 0,
              input: [
                {
                  delay: '@flowInput.delay',
                },
              ],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
            },
          ],
          experimentName: 'main',
        },
        {
          modified: 1725422936405,
          name: 'FQWUzPOx',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'eval-alg',
              input: ['#@flowInput.inp'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['#@green.0'],
              includeInResults: false,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          triggers: {
            pipelines: ['simple2'],
          },
          kind: 'batch',
          experimentName: 'main',
          priority: 3,
        },
        {
          modified: 1725422820549,
          name: 's5q12ado',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'eval-alg',
              input: ['jnk'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['#@green.0'],
              includeInResults: false,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          triggers: {
            pipelines: ['simple2'],
          },
          kind: 'batch',
          experimentName: 'main',
          priority: 3,
        },
        {
          modified: 1725371949275,
          name: 'dywiF9Fj',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'eval-alg',
              input: ['[1,2]'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['#@green.0'],
              includeInResults: false,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          triggers: {
            pipelines: ['SGLFHkJI'],
          },
          kind: 'batch',
          experimentName: 'main',
          priority: 3,
        },
        {
          modified: 1725371946027,
          name: 'x6GPMTml',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'eval-alg',
              input: ['#@flowInput.inp'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['#@green.0'],
              includeInResults: false,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          triggers: {
            pipelines: ['IvvsxpDE'],
          },
          kind: 'batch',
          experimentName: 'main',
          priority: 3,
        },
        {
          modified: 1725371195855,
          name: 'IvvsxpDE',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'eval-alg',
              input: ['#@flowInput.inp'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['#@green.0'],
              includeInResults: false,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          triggers: {
            pipelines: ['simple2'],
          },
          kind: 'batch',
          experimentName: 'main',
          priority: 3,
        },
        {
          modified: 1725370956523,
          name: 'bmaw8rDA',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'eval-alg',
              input: ['jnk'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['#@green.0'],
              includeInResults: false,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          triggers: {
            pipelines: ['simple2'],
          },
          kind: 'batch',
          experimentName: 'main',
          priority: 3,
        },
        {
          modified: 1716125514715,
          name: 'numbers',
          description: 'example pipe',
          kind: 'batch',
          flowInput: {
            data: 5,
            mul: 2,
          },
          nodes: [
            {
              nodeName: 'Range',
              algorithmName: 'hkube-example-range',
              input: ['@flowInput.data'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'Multiply',
              algorithmName: 'hkube-example-mult',
              input: ['#@Range', '@flowInput.mul'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'Reduce',
              algorithmName: 'hkube-example-sum',
              input: ['@Multiply'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            batchTolerance: 80,
            ttl: 3600,
            progressVerbosityLevel: 'info',
          },
          priority: 3,
          experimentName: 'main',
        },
        {
          modified: 1713673508714,
          name: 'stayuppipe',
          kind: 'batch',
          nodes: [
            {
              nodeName: 'stayupnode',
              algorithmName: 'stayup',
              input: [],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              batchOperation: 'indexed',
              ttl: 0,
              includeInResult: false,
              metrics: {
                tensorboard: true,
              },
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          triggers: {
            cron: {
              enabled: false,
              pattern: '0 * * * *',
            },
            pipelines: [],
          },
          options: {
            batchTolerance: 80,
            concurrentPipelines: {
              amount: 1,
              rejectOnFailure: false,
            },
            ttl: -1,
            progressVerbosityLevel: 'info',
          },
          priority: 3,
          experimentName: 'main',
        },
        {
          modified: 1711954352294,
          name: 'stayuppipe5',
          kind: 'batch',
          nodes: [
            {
              nodeName: 'stayupnode',
              algorithmName: 'stayup',
              input: [],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              batchOperation: 'indexed',
              ttl: 0,
              includeInResult: false,
              metrics: {
                tensorboard: true,
              },
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          triggers: {
            cron: {
              enabled: false,
              pattern: '0 * * * *',
            },
            pipelines: [],
          },
          options: {
            batchTolerance: 80,
            concurrentPipelines: {
              amount: 1,
              rejectOnFailure: false,
            },
            ttl: -1,
            progressVerbosityLevel: 'info',
          },
          priority: 3,
          experimentName: 'main',
        },
        {
          modified: 1711954321821,
          name: 'stayuppipe4',
          kind: 'batch',
          nodes: [
            {
              nodeName: 'stayupnode',
              algorithmName: 'stayup',
              input: [],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              batchOperation: 'indexed',
              ttl: 0,
              includeInResult: false,
              metrics: {
                tensorboard: true,
              },
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          triggers: {
            cron: {
              enabled: false,
              pattern: '0 * * * *',
            },
            pipelines: [],
          },
          options: {
            batchTolerance: 80,
            concurrentPipelines: {
              amount: 1,
              rejectOnFailure: false,
            },
            ttl: -1,
            progressVerbosityLevel: 'info',
          },
          priority: 3,
          experimentName: 'main',
        },
        {
          modified: 1711954302292,
          name: 'stayuppipe3',
          kind: 'batch',
          nodes: [
            {
              nodeName: 'stayupnode',
              algorithmName: 'stayup',
              input: [],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              batchOperation: 'indexed',
              ttl: 0,
              includeInResult: false,
              metrics: {
                tensorboard: true,
              },
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          triggers: {
            cron: {
              enabled: false,
              pattern: '0 * * * *',
            },
            pipelines: [],
          },
          options: {
            batchTolerance: 80,
            concurrentPipelines: {
              amount: 1,
              rejectOnFailure: false,
            },
            ttl: -1,
            progressVerbosityLevel: 'info',
          },
          priority: 3,
          experimentName: 'main',
        },
        {
          modified: 1711954271561,
          name: 'stayuppipe2',
          kind: 'batch',
          nodes: [
            {
              nodeName: 'stayupnode',
              algorithmName: 'stayup',
              input: [],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              batchOperation: 'indexed',
              ttl: 0,
              includeInResult: false,
              metrics: {
                tensorboard: true,
              },
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          triggers: {
            cron: {
              enabled: false,
              pattern: '0 * * * *',
            },
            pipelines: [],
          },
          options: {
            batchTolerance: 80,
            concurrentPipelines: {
              amount: 1,
              rejectOnFailure: false,
            },
            ttl: -1,
            progressVerbosityLevel: 'info',
          },
          priority: 3,
          experimentName: 'main',
        },
        {
          modified: 1705399017242,
          name: 'golan-streaming',
          kind: 'stream',
          flowInput: {
            msgPerSec: 80,
            delay: 0.033,
            rate: 100,
          },
          streaming: {
            flows: {
              analyze: 'A >> B>>C',
            },
            defaultFlow: 'analyze',
          },
          triggers: {
            cron: {
              enabled: false,
              pattern: '0 * * * *',
            },
            pipelines: [],
          },
          options: {
            batchTolerance: 80,
            concurrentPipelines: {
              amount: 10,
              rejectOnFailure: true,
            },
            ttl: 3600,
            progressVerbosityLevel: 'info',
          },
          priority: 3,
          nodes: [
            {
              stateType: 'stateful',
              nodeName: 'A',
              algorithmName: 'sending',
              input: [
                {
                  totalMsg: 1000000,
                  rng: 10,
                  burst: 2,
                  burstDuration: 30,
                  burstTime: 160,
                  sleepTime: [7, 60],
                  error: false,
                  size: 1,
                  ping: 30,
                },
              ],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              stateType: 'stateless',
              nodeName: 'B',
              algorithmName: 'getting',
              minStatelessCount: 1,
              maxStatelessCount: 1,
              input: [],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
            },
            {
              stateType: 'stateless',
              nodeName: 'C',
              algorithmName: 'get-send-stat',
              minStatelessCount: 0,
              maxStatelessCount: 0,
              input: [
                {
                  delay: '@flowInput.delay',
                },
              ],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
            },
          ],
          experimentName: 'main',
        },
        {
          modified: 1704322020580,
          name: '1bahYGZS',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'eval-alg',
              input: ['jnk'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['#@green.0'],
              includeInResults: false,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          triggers: {
            pipelines: ['simple2'],
          },
          kind: 'batch',
          experimentName: 'main',
          priority: 3,
        },
        {
          modified: 1704236307579,
          name: '2KnNeka2',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'eval-alg',
              input: ['#@flowInput.inp'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['#@green.0'],
              includeInResults: false,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          triggers: {
            pipelines: ['IhE3IWHg'],
          },
          kind: 'batch',
          experimentName: 'main',
          priority: 3,
        },
        {
          modified: 1701866234068,
          name: 'streaming-demo',
          kind: 'stream',
          flowInput: {
            msgPerSec: 80,
            delay: 0.033,
            rate: 100,
          },
          nodes: [
            {
              nodeName: 'A',
              algorithmName: 'stayup',
              stateType: 'stateful',
              input: [
                {
                  totalMsg: 1000000,
                  rng: 10,
                  burst: 2,
                  burstDuration: 30,
                  burstTime: 160,
                  sleepTime: [7, 60],
                  error: false,
                  size: 1,
                  ping: 30,
                },
              ],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'B',
              algorithmName: 'yellow-alg',
              stateType: 'stateless',
              minStatelessCount: 1,
              maxStatelessCount: 1,
              input: [],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
            },
          ],
          streaming: {
            flows: {
              analyze: 'A>>B',
            },
            defaultFlow: 'analyze',
          },
          triggers: {
            cron: {
              enabled: false,
              pattern: '0 * * * *',
            },
            pipelines: [],
          },
          options: {
            batchTolerance: 80,
            concurrentPipelines: {
              amount: 10,
              rejectOnFailure: true,
            },
            ttl: 3600,
            progressVerbosityLevel: 'info',
          },
          priority: 3,
          experimentName: 'main',
        },
        {
          modified: 1701764361873,
          name: 'streaming',
          kind: 'stream',
          flowInput: {
            msgPerSec: 30,
            delay: 0.033,
          },
          nodes: [
            {
              nodeName: 'A',
              algorithmName: 'stream-alg',
              stateType: 'stateful',
              input: [
                {
                  msgPerSec: '@flowInput.msgPerSec',
                },
              ],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'B',
              algorithmName: 'stream-alg',
              stateType: 'stateless',
              minStatelessCount: 0,
              maxStatelessCount: 0,
              input: [
                {
                  delay: '@flowInput.delay',
                },
              ],
              kind: 'algorithm',
            },
            {
              nodeName: 'C',
              algorithmName: 'stream-alg',
              stateType: 'stateless',
              minStatelessCount: 3,
              input: [
                {
                  delay: '@flowInput.delay',
                },
              ],
              kind: 'algorithm',
            },
            {
              nodeName: 'D',
              algorithmName: 'stream-alg',
              stateType: 'stateless',
              minStatelessCount: 1,
              input: [
                {
                  delay: '@flowInput.delay',
                },
              ],
              kind: 'algorithm',
            },
          ],
          streaming: {
            flows: {
              analyze: 'A >> B&C&D',
            },
          },
          options: {
            batchTolerance: 80,
            ttl: 3600,
            progressVerbosityLevel: 'info',
          },
          priority: 3,
          experimentName: 'main',
        },
        {
          modified: 1700483025580,
          name: 'batch',
          kind: 'batch',
          flowInput: {
            files: {
              links: [
                'links-1',
                'links-2',
                'links-3',
                'links-4',
                'links-5',
                'links-6',
                'links-7',
                'links-8',
                'links-9',
                'links-10',
              ],
            },
          },
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'green-alg',
              input: ['#@flowInput.files.links'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['#@green'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            batchTolerance: 100,
            progressVerbosityLevel: 'debug',
            ttl: 3600,
          },
          experimentName: 'main',
          priority: 3,
        },
        {
          modified: 1700138775882,
          name: 'golan-streaming2',
          kind: 'stream',
          flowInput: {
            msgPerSec: 80,
            delay: 0.033,
            rate: 100,
          },
          nodes: [
            {
              nodeName: 'A',
              algorithmName: 'sending',
              stateType: 'stateful',
              input: [
                {
                  totalMsg: 1000000,
                  rng: 10,
                  burst: 2,
                  burstDuration: 30,
                  burstTime: 160,
                  sleepTime: [7, 60],
                  error: false,
                  size: 1,
                  ping: 30,
                },
              ],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'B',
              algorithmName: 'getting',
              stateType: 'stateless',
              minStatelessCount: 0,
              input: [],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
            },
            {
              nodeName: 'E',
              algorithmName: 'getting',
              stateType: 'stateless',
              minStatelessCount: 0,
              input: [],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
            },
            {
              nodeName: 'C',
              algorithmName: 'get-send-stat',
              stateType: 'stateless',
              minStatelessCount: 0,
              input: [
                {
                  delay: '@flowInput.delay',
                },
              ],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
            },
          ],
          streaming: {
            flows: {
              analyze: 'A >>  B & E >> C',
            },
            defaultFlow: 'analyze',
          },
          triggers: {
            cron: {
              enabled: false,
              pattern: '0 * * * *',
            },
            pipelines: [],
          },
          options: {
            batchTolerance: 80,
            concurrentPipelines: {
              amount: 10,
              rejectOnFailure: true,
            },
            ttl: 3600,
            progressVerbosityLevel: 'info',
          },
          priority: 3,
          experimentName: 'main',
        },
        {
          modified: 1699258822610,
          name: 'ziv-streaming-test-v6',
          kind: 'stream',
          flowInput: {
            msgPerSec: 80,
            delay: 0.033,
            rate: 100,
          },
          nodes: [
            {
              nodeName: 'A',
              algorithmName: 'sending',
              stateType: 'stateful',
              input: [
                {
                  totalMsg: 1000000,
                  rng: 10,
                  burst: 2,
                  burstDuration: 30,
                  burstTime: 160,
                  sleepTime: [7, 60],
                  error: false,
                  size: 1,
                  ping: 30,
                },
              ],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'B',
              algorithmName: 'getting',
              stateType: 'stateless',
              minStatelessCount: 0,
              maxStatelessCount: 0,
              input: [],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
            },
            {
              nodeName: 'C',
              algorithmName: 'get-send-stat',
              stateType: 'stateful',
              input: [
                {
                  delay: '@flowInput.delay',
                },
              ],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'D',
              algorithmName: 'sending',
              stateType: 'stateful',
              input: [
                {
                  totalMsg: 1000000,
                  rng: 10,
                  burst: 2,
                  burstDuration: 30,
                  burstTime: 160,
                  sleepTime: [7, 60],
                  error: false,
                  size: 1,
                  ping: 30,
                },
              ],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'E',
              algorithmName: 'getting',
              stateType: 'stateless',
              minStatelessCount: 0,
              maxStatelessCount: 0,
              input: [],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
            },
            {
              nodeName: 'F',
              algorithmName: 'get-send-stat',
              stateType: 'stateful',
              input: [
                {
                  delay: '@flowInput.delay',
                },
              ],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'G',
              algorithmName: 'sending',
              stateType: 'stateful',
              input: [
                {
                  totalMsg: 1000000,
                  rng: 10,
                  burst: 2,
                  burstDuration: 30,
                  burstTime: 160,
                  sleepTime: [7, 60],
                  error: false,
                  size: 1,
                  ping: 30,
                },
              ],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'H',
              algorithmName: 'getting',
              stateType: 'stateless',
              minStatelessCount: 0,
              maxStatelessCount: 0,
              input: [],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
            },
            {
              nodeName: 'I',
              algorithmName: 'sending',
              stateType: 'stateful',
              input: [
                {
                  totalMsg: 1000000,
                  rng: 10,
                  burst: 2,
                  burstDuration: 30,
                  burstTime: 160,
                  sleepTime: [7, 60],
                  error: false,
                  size: 1,
                  ping: 30,
                },
              ],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'J',
              algorithmName: 'getting',
              stateType: 'stateless',
              minStatelessCount: 0,
              maxStatelessCount: 0,
              input: [],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
            },
            {
              nodeName: 'K',
              algorithmName: 'get-send-stat',
              stateType: 'stateful',
              input: [
                {
                  delay: '@flowInput.delay',
                },
              ],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'L',
              algorithmName: 'sending',
              stateType: 'stateful',
              input: [
                {
                  totalMsg: 1000000,
                  rng: 10,
                  burst: 2,
                  burstDuration: 30,
                  burstTime: 160,
                  sleepTime: [7, 60],
                  error: false,
                  size: 1,
                  ping: 30,
                },
              ],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'N',
              algorithmName: 'getting',
              stateType: 'stateless',
              minStatelessCount: 0,
              maxStatelessCount: 0,
              input: [],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
            },
            {
              nodeName: 'M',
              algorithmName: 'get-send-stat',
              stateType: 'stateful',
              input: [
                {
                  delay: '@flowInput.delay',
                },
              ],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'O',
              algorithmName: 'sending',
              stateType: 'stateful',
              input: [
                {
                  totalMsg: 1000000,
                  rng: 10,
                  burst: 2,
                  burstDuration: 30,
                  burstTime: 160,
                  sleepTime: [7, 60],
                  error: false,
                  size: 1,
                  ping: 30,
                },
              ],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'P',
              algorithmName: 'getting',
              stateType: 'stateless',
              minStatelessCount: 0,
              maxStatelessCount: 0,
              input: [],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
            },
            {
              nodeName: 'Q',
              algorithmName: 'get-send-stat',
              stateType: 'stateful',
              input: [
                {
                  delay: '@flowInput.delay',
                },
              ],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'R',
              algorithmName: 'sending',
              stateType: 'stateful',
              input: [
                {
                  totalMsg: 1000000,
                  rng: 10,
                  burst: 2,
                  burstDuration: 30,
                  burstTime: 160,
                  sleepTime: [7, 60],
                  error: false,
                  size: 1,
                  ping: 30,
                },
              ],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'S',
              algorithmName: 'getting',
              stateType: 'stateless',
              minStatelessCount: 0,
              maxStatelessCount: 0,
              input: [],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
            },
            {
              nodeName: 'AA',
              algorithmName: 'sending',
              stateType: 'stateful',
              input: [
                {
                  totalMsg: 1000000,
                  rng: 10,
                  burst: 2,
                  burstDuration: 30,
                  burstTime: 160,
                  sleepTime: [7, 60],
                  error: false,
                  size: 1,
                  ping: 30,
                },
              ],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'BB',
              algorithmName: 'getting',
              stateType: 'stateless',
              minStatelessCount: 0,
              maxStatelessCount: 0,
              input: [],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
            },
            {
              nodeName: 'CC',
              algorithmName: 'get-send-stat',
              stateType: 'stateful',
              input: [
                {
                  delay: '@flowInput.delay',
                },
              ],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'DD',
              algorithmName: 'sending',
              stateType: 'stateful',
              input: [
                {
                  totalMsg: 1000000,
                  rng: 10,
                  burst: 2,
                  burstDuration: 30,
                  burstTime: 160,
                  sleepTime: [7, 60],
                  error: false,
                  size: 1,
                  ping: 30,
                },
              ],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'EE',
              algorithmName: 'getting',
              stateType: 'stateless',
              minStatelessCount: 0,
              maxStatelessCount: 0,
              input: [],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
            },
            {
              nodeName: 'FF',
              algorithmName: 'get-send-stat',
              stateType: 'stateful',
              input: [
                {
                  delay: '@flowInput.delay',
                },
              ],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'GG',
              algorithmName: 'sending',
              stateType: 'stateful',
              input: [
                {
                  totalMsg: 1000000,
                  rng: 10,
                  burst: 2,
                  burstDuration: 30,
                  burstTime: 160,
                  sleepTime: [7, 60],
                  error: false,
                  size: 1,
                  ping: 30,
                },
              ],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'HH',
              algorithmName: 'getting',
              stateType: 'stateless',
              minStatelessCount: 0,
              maxStatelessCount: 0,
              input: [],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
            },
            {
              nodeName: 'II',
              algorithmName: 'sending',
              stateType: 'stateful',
              input: [
                {
                  totalMsg: 1000000,
                  rng: 10,
                  burst: 2,
                  burstDuration: 30,
                  burstTime: 160,
                  sleepTime: [7, 60],
                  error: false,
                  size: 1,
                  ping: 30,
                },
              ],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'JJ',
              algorithmName: 'getting',
              stateType: 'stateless',
              minStatelessCount: 0,
              maxStatelessCount: 0,
              input: [],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
            },
            {
              nodeName: 'KK',
              algorithmName: 'get-send-stat',
              stateType: 'stateful',
              input: [
                {
                  delay: '@flowInput.delay',
                },
              ],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'LL',
              algorithmName: 'sending',
              stateType: 'stateful',
              input: [
                {
                  totalMsg: 1000000,
                  rng: 10,
                  burst: 2,
                  burstDuration: 30,
                  burstTime: 160,
                  sleepTime: [7, 60],
                  error: false,
                  size: 1,
                  ping: 30,
                },
              ],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'NN',
              algorithmName: 'getting',
              stateType: 'stateless',
              minStatelessCount: 0,
              maxStatelessCount: 0,
              input: [],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
            },
            {
              nodeName: 'MM',
              algorithmName: 'get-send-stat',
              stateType: 'stateful',
              input: [
                {
                  delay: '@flowInput.delay',
                },
              ],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'OO',
              algorithmName: 'sending',
              stateType: 'stateful',
              input: [
                {
                  totalMsg: 1000000,
                  rng: 10,
                  burst: 2,
                  burstDuration: 30,
                  burstTime: 160,
                  sleepTime: [7, 60],
                  error: false,
                  size: 1,
                  ping: 30,
                },
              ],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'PP',
              algorithmName: 'getting',
              stateType: 'stateless',
              minStatelessCount: 0,
              maxStatelessCount: 0,
              input: [],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
            },
            {
              nodeName: 'QQ',
              algorithmName: 'get-send-stat',
              stateType: 'stateful',
              input: [
                {
                  delay: '@flowInput.delay',
                },
              ],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'RR',
              algorithmName: 'sending',
              stateType: 'stateful',
              input: [
                {
                  totalMsg: 1000000,
                  rng: 10,
                  burst: 2,
                  burstDuration: 30,
                  burstTime: 160,
                  sleepTime: [7, 60],
                  error: false,
                  size: 1,
                  ping: 30,
                },
              ],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'SS',
              algorithmName: 'getting',
              stateType: 'stateless',
              minStatelessCount: 0,
              maxStatelessCount: 0,
              input: [],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
            },
          ],
          streaming: {
            flows: {
              analyze:
                'A >> B >> D & E >> F & G & C >> H & I >> J & K >> L >> N >> M &O >>P>>Q>>R&S >> AA >> BB >> DD & EE >> FF & GG & CC >> HH & II >> JJ & KK >> LL >> NN >> MM & OO >> PP >> QQ >> RR & SS',
              key2: ' A >> B',
            },
          },
          triggers: {
            cron: {
              enabled: false,
              pattern: '0 * * * *',
            },
            pipelines: [],
          },
          options: {
            batchTolerance: 80,
            concurrentPipelines: {
              amount: 10,
              rejectOnFailure: true,
            },
            ttl: 3600,
            progressVerbosityLevel: 'info',
          },
          priority: 3,
          experimentName: 'main',
        },
        {
          modified: 1698879556871,
          name: '3dbbdCH5',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'eval-alg',
              input: ['[1,2]'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['#@green.0'],
              includeInResults: false,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          triggers: {
            pipelines: ['EmcD5NYr'],
          },
          kind: 'batch',
          experimentName: 'main',
          priority: 3,
        },
        {
          modified: 1698793055409,
          name: '3eQs6ncK',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'eval-alg',
              input: ['#@flowInput.inp'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['#@green.0'],
              includeInResults: false,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          triggers: {
            pipelines: ['EUKPwCos'],
          },
          kind: 'batch',
          experimentName: 'main',
          priority: 3,
        },
        {
          modified: 1698792374161,
          name: '1HXa4Jtu',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'eval-alg',
              input: ['jnk'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['#@green.0'],
              includeInResults: false,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          triggers: {
            pipelines: ['simple2'],
          },
          kind: 'batch',
          experimentName: 'main',
          priority: 3,
        },
        {
          modified: 1697717228231,
          name: '3ISgi78f',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'eval-alg',
              input: ['#@flowInput.inp'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['#@green.0'],
              includeInResults: false,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          triggers: {
            pipelines: ['simple2'],
          },
          kind: 'batch',
          experimentName: 'main',
          priority: 3,
        },
        {
          modified: 1697462586053,
          name: '2dovkoBZ',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'eval-alg',
              input: ['#@flowInput.inp'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['#@green.0'],
              includeInResults: false,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          triggers: {
            pipelines: ['simple2'],
          },
          kind: 'batch',
          experimentName: 'main',
          priority: 3,
        },
        {
          modified: 1696201221768,
          name: '0IvLhmPZ',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'eval-alg',
              input: ['#@flowInput.inp'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['#@green.0'],
              includeInResults: false,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          triggers: {
            pipelines: ['kBKembU4'],
          },
          kind: 'batch',
          experimentName: 'main',
          priority: 3,
        },
        {
          modified: 1695855653790,
          name: '0e769Cgf',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'eval-alg',
              input: ['#@flowInput.inp'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['#@green.0'],
              includeInResults: false,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          triggers: {
            pipelines: ['6DliGbfY'],
          },
          kind: 'batch',
          experimentName: 'main',
          priority: 3,
        },
        {
          modified: 1694559329144,
          name: '1nZTxSOG',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'eval-alg',
              input: ['#@flowInput.inp'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['#@green.0'],
              includeInResults: false,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          triggers: {
            pipelines: ['simple2'],
          },
          kind: 'batch',
          experimentName: 'main',
          priority: 3,
        },
        {
          modified: 1694387001238,
          name: '2CDbxf2L',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'eval-alg',
              input: ['[1,2]'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['#@green.0'],
              includeInResults: false,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          triggers: {
            pipelines: ['Ug8IqYhT'],
          },
          kind: 'batch',
          experimentName: 'main',
          priority: 3,
        },
        {
          modified: 1693349828007,
          name: '1cgxIWVD',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'eval-alg',
              input: ['#@flowInput.inp'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['#@green.0'],
              includeInResults: false,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          triggers: {
            pipelines: ['simple2'],
          },
          kind: 'batch',
          experimentName: 'main',
          priority: 3,
        },
        {
          modified: 1692226256757,
          name: '0gLa7xiw',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'eval-alg',
              input: ['jnk'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['#@green.0'],
              includeInResults: false,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          triggers: {
            pipelines: ['simple2'],
          },
          kind: 'batch',
          experimentName: 'main',
          priority: 3,
        },
        {
          modified: 1691670485172,
          name: 'testDsDir',
          kind: 'batch',
          nodes: [
            {
              kind: 'dataSource',
              nodeName: 'Source',
              spec: {
                name: 'testSnap',
                snapshot: {
                  name: 'test test ',
                },
              },
              input: [],
            },
            {
              nodeName: 'green',
              algorithmName: 'green-alg',
              input: ['@Source'],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              batchOperation: 'indexed',
              kind: 'algorithm',
            },
          ],
          triggers: {
            cron: {
              enabled: false,
              pattern: '0 * * * *',
            },
            pipelines: [],
          },
          options: {
            batchTolerance: 80,
            concurrentPipelines: {
              amount: 10,
              rejectOnFailure: true,
            },
            ttl: 3600,
            progressVerbosityLevel: 'info',
          },
          priority: 3,
          experimentName: 'main',
        },
        {
          modified: 1691652603866,
          name: 'stream-without-flow',
          kind: 'stream',
          flowInput: {
            msgPerSec: 30,
            delay: 0.033,
          },
          nodes: [
            {
              nodeName: 'A',
              algorithmName: 'stream-alg',
              stateType: 'stateful',
              input: [
                {
                  msgPerSec: '@flowInput.msgPerSec',
                },
              ],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'B',
              algorithmName: 'stream-alg',
              input: [
                {
                  delay: '@flowInput.delay',
                },
              ],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'C',
              algorithmName: 'stream-alg',
              stateType: 'stateless',
              input: [
                {
                  delay: '@flowInput.delay',
                },
              ],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'D',
              algorithmName: 'stream-alg',
              stateType: 'stateless',
              input: [
                {
                  delay: '@flowInput.delay',
                },
              ],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            batchTolerance: 80,
            ttl: 3600,
            progressVerbosityLevel: 'info',
          },
          priority: 3,
          experimentName: 'main',
        },
        {
          modified: 1690757626784,
          name: '0MtFjLbz',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'eval-alg',
              input: ['#@flowInput.inp'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['#@green.0'],
              includeInResults: false,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          triggers: {
            pipelines: ['simple2'],
          },
          kind: 'batch',
          experimentName: 'main',
          priority: 3,
        },
        {
          modified: 1690153349384,
          name: '1Z2F2lEV',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'eval-alg',
              input: ['#@flowInput.inp'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['#@green.0'],
              includeInResults: false,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          triggers: {
            pipelines: ['7Kn8756k'],
          },
          kind: 'batch',
          experimentName: 'main',
          priority: 3,
        },
        {
          modified: 1689548565419,
          name: '0RSn34Kp',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'eval-alg',
              input: ['[1,2]'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['#@green.0'],
              includeInResults: false,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          triggers: {
            pipelines: ['orUB5u5k'],
          },
          kind: 'batch',
          experimentName: 'main',
          priority: 3,
        },
        {
          modified: 1689202936908,
          name: '1H5ykImD',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'eval-alg',
              input: ['#@flowInput.inp'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['#@green.0'],
              includeInResults: false,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          triggers: {
            pipelines: ['m3THHqlt'],
          },
          kind: 'batch',
          experimentName: 'main',
          priority: 3,
        },
        {
          modified: 1688943168578,
          name: '0lAzCLWk',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'eval-alg',
              input: ['#@flowInput.inp'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['#@green.0'],
              includeInResults: false,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          triggers: {
            pipelines: ['simple2'],
          },
          kind: 'batch',
          experimentName: 'main',
          priority: 3,
        },
        {
          modified: 1687993213485,
          name: '2zTe8JQj',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'eval-alg',
              input: ['#@flowInput.inp'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['#@green.0'],
              includeInResults: false,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          triggers: {
            pipelines: ['7VOvOxbr'],
          },
          kind: 'batch',
          experimentName: 'main',
          priority: 3,
        },
        {
          modified: 1687341087032,
          name: '0u4cC5la',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'eval-alg',
              input: ['#@flowInput.inp'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['#@green.0'],
              includeInResults: false,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          triggers: {
            pipelines: ['simple2'],
          },
          kind: 'batch',
          experimentName: 'main',
          priority: 3,
        },
        {
          modified: 1687325885403,
          name: '0P2izFAM',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'eval-alg',
              input: ['jnk'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['#@green.0'],
              includeInResults: false,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          triggers: {
            pipelines: ['simple2'],
          },
          kind: 'batch',
          experimentName: 'main',
          priority: 3,
        },
        {
          modified: 1687215595230,
          name: '3gFO4Sv3',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'eval-alg',
              input: ['#@flowInput.inp'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['#@green.0'],
              includeInResults: false,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          triggers: {
            pipelines: ['u5O3x5Yp'],
          },
          kind: 'batch',
          experimentName: 'main',
          priority: 3,
        },
        {
          modified: 1686609958845,
          name: '2sfLf7I8',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'eval-alg',
              input: ['jnk'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['#@green.0'],
              includeInResults: false,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          triggers: {
            pipelines: ['simple2'],
          },
          kind: 'batch',
          experimentName: 'main',
          priority: 3,
        },
        {
          modified: 1685955969706,
          name: 'failed-scheduling-first-node',
          kind: 'batch',
          flowInput: {
            files: {
              links: [
                'links-1',
                'links-2',
                'links-3',
                'links-4',
                'links-5',
                'links-6',
                'links-7',
                'links-8',
                'links-9',
                'links-10',
              ],
            },
          },
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'high-cpu-algo',
              input: ['#@flowInput.files.links'],
              batchOperation: 'indexed',
              kind: 'algorithm',
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['@green'],
              batchOperation: 'indexed',
              kind: 'algorithm',
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              batchOperation: 'indexed',
              kind: 'algorithm',
            },
          ],
          triggers: {
            cron: {
              enabled: false,
              pattern: '0 * * * *',
            },
            pipelines: [],
          },
          options: {
            batchTolerance: 100,
            concurrentPipelines: {
              amount: 10,
              rejectOnFailure: true,
            },
            ttl: 3600,
            progressVerbosityLevel: 'debug',
          },
          priority: 3,
          experimentName: 'main',
        },
        {
          modified: 1685955143221,
          name: 'failed-schedualing',
          kind: 'batch',
          flowInput: {
            files: {
              links: [
                'links-1',
                'links-2',
                'links-3',
                'links-4',
                'links-5',
                'links-6',
                'links-7',
                'links-8',
                'links-9',
                'links-10',
              ],
            },
          },
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'high-cpu-algo',
              input: ['#@flowInput.files.links', '@yellow'],
              batchOperation: 'indexed',
              kind: 'algorithm',
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: [],
              batchOperation: 'indexed',
              kind: 'algorithm',
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              batchOperation: 'indexed',
              kind: 'algorithm',
            },
          ],
          triggers: {
            cron: {
              enabled: false,
              pattern: '0 * * * *',
            },
            pipelines: [],
          },
          options: {
            batchTolerance: 100,
            concurrentPipelines: {
              amount: 10,
              rejectOnFailure: true,
            },
            ttl: 3600,
            progressVerbosityLevel: 'debug',
          },
          priority: 3,
          experimentName: 'main',
        },
        {
          modified: 1684364305960,
          name: '2yOsJL70',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'eval-alg',
              input: ['#@flowInput.inp'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['#@green.0'],
              includeInResults: false,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          triggers: {
            pipelines: ['VWWcDwVd'],
          },
          kind: 'batch',
          experimentName: 'main',
          priority: 3,
        },
        {
          modified: 1682290733236,
          name: '2bdq6uJB',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'eval-alg',
              input: ['[1,2]'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['#@green.0'],
              includeInResults: false,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          triggers: {
            pipelines: ['FI0VkbfK'],
          },
          kind: 'batch',
          experimentName: 'main',
          priority: 3,
        },
        {
          modified: 1682290728090,
          name: '2as51wZN',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'eval-alg',
              input: ['#@flowInput.inp'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['#@green.0'],
              includeInResults: false,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          triggers: {
            pipelines: ['aOTwdeAE'],
          },
          kind: 'batch',
          experimentName: 'main',
          priority: 3,
        },
        {
          modified: 1679439989975,
          name: '2cIHoydT',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'eval-alg',
              input: ['#@flowInput.inp'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['#@green.0'],
              includeInResults: false,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          triggers: {
            pipelines: ['xOfZudqO'],
          },
          kind: 'batch',
          experimentName: 'main',
          priority: 3,
        },
        {
          modified: 1678920566257,
          name: '0wGUfiNI',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'eval-alg',
              input: ['jnk'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['#@green.0'],
              includeInResults: false,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          triggers: {
            pipelines: ['simple2'],
          },
          kind: 'batch',
          experimentName: 'main',
          priority: 3,
        },
        {
          modified: 1678402406505,
          name: '0n8RshOR',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'eval-alg',
              input: ['#@flowInput.inp'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['#@green.0'],
              includeInResults: false,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          triggers: {
            pipelines: ['simple2'],
          },
          kind: 'batch',
          experimentName: 'main',
          priority: 3,
        },
        {
          modified: 1677144056295,
          name: '2eTOkf6q',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'eval-alg',
              input: ['jnk'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['#@green.0'],
              includeInResults: false,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          triggers: {
            pipelines: ['simple2'],
          },
          kind: 'batch',
          experimentName: 'main',
          priority: 3,
        },
        {
          modified: 1676987652089,
          name: '3djqvDkG',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'eval-alg',
              input: ['[1,2]'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['#@green.0'],
              includeInResults: false,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          triggers: {
            pipelines: ['AcES9K0J'],
          },
          kind: 'batch',
          experimentName: 'main',
          priority: 3,
        },
        {
          modified: 1676876884986,
          name: '0aIWYOaR',
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'eval-alg',
              input: ['#@flowInput.inp'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['#@green.0'],
              includeInResults: false,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            ttl: 3600,
            batchTolerance: 80,
            progressVerbosityLevel: 'info',
          },
          triggers: {
            pipelines: ['simple2'],
          },
          kind: 'batch',
          experimentName: 'main',
          priority: 3,
        },
        {
          modified: 1673269961719,
          name: 'simple',
          kind: 'batch',
          flowInput: {
            files: {
              link: 'links-1',
            },
          },
          nodes: [
            {
              nodeName: 'green',
              algorithmName: 'green-alg',
              input: [
                '@flowInput.files.link',
                {
                  a: 'b',
                },
              ],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              batchOperation: 'indexed',
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'yellow',
              algorithmName: 'yellow-alg',
              input: ['@green'],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              batchOperation: 'indexed',
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
            {
              nodeName: 'black',
              algorithmName: 'black-alg',
              input: ['@yellow'],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              batchOperation: 'indexed',
              ttl: 0,
              kind: 'algorithm',
              minStatelessCount: 0,
            },
          ],
          options: {
            batchTolerance: 100,
            concurrentPipelines: {
              amount: 1,
              rejectOnFailure: false,
            },
            ttl: 3600,
            progressVerbosityLevel: 'debug',
          },
          priority: 3,
          experimentName: 'main',
          triggers: {
            cron: {
              enabled: false,
              pattern: '0 * * * *',
            },
          },
        },
        {
          modified: 1673184398571,
          name: 'not2',
          kind: 'batch',
          nodes: [
            {
              nodeName: 'not1',
              algorithmName: 'notexsit',
              input: [],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              batchOperation: 'indexed',
              ttl: 0,
              includeInResult: false,
              metrics: {
                tensorboard: true,
              },
              kind: 'algorithm',
            },
            {
              nodeName: 'not2',
              algorithmName: 'notexsit',
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              batchOperation: 'indexed',
              ttl: 0,
              input: [],
              kind: 'algorithm',
            },
          ],
          triggers: {
            cron: {
              enabled: false,
              pattern: '0 * * * *',
            },
            pipelines: [],
          },
          options: {
            batchTolerance: 80,
            concurrentPipelines: {
              amount: 10,
              rejectOnFailure: true,
            },
            ttl: 3600,
            progressVerbosityLevel: 'info',
          },
          priority: 3,
          experimentName: 'main',
        },
        {
          modified: 1672153400581,
          name: 'stream_xxx4',
          kind: 'stream',
          nodes: [
            {
              nodeName: 'A',
              algorithmName: 'xxx4',
              stateType: 'stateful',
              input: [],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              includeInResult: false,
              metrics: {
                tensorboard: true,
              },
              kind: 'algorithm',
            },
            {
              nodeName: 'B',
              algorithmName: 'xxx4',
              stateType: 'stateless',
              input: [],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
            },
            {
              nodeName: 'C',
              algorithmName: 'xxx4',
              stateType: 'stateful',
              input: [],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              ttl: 0,
              kind: 'algorithm',
            },
          ],
          streaming: {
            flows: {
              analyze: ' A >> B >> C',
            },
            defaultFlow: 'analyze',
          },
          triggers: {
            cron: {
              enabled: false,
              pattern: '0 * * * *',
            },
          },
          options: {
            batchTolerance: 80,
            concurrentPipelines: {
              amount: 1,
              rejectOnFailure: false,
            },
            ttl: 36000,
            progressVerbosityLevel: 'info',
          },
          priority: 3,
          experimentName: 'main',
        },
        {
          modified: 1671710339643,
          name: 'eval--pipe',
          kind: 'batch',
          nodes: [
            {
              nodeName: 'eval',
              algorithmName: 'eval-alg',
              input: [],
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              extraData: {
                code: [
                  'async function run(input, self) {',
                  "console.log('loggggg')",
                  '}',
                ],
              },
              batchOperation: 'indexed',
              ttl: 0,
              includeInResult: false,
              metrics: {
                tensorboard: true,
              },
              kind: 'algorithm',
            },
          ],
          triggers: {
            cron: {
              enabled: false,
              pattern: '0 * * * *',
            },
            pipelines: [],
          },
          options: {
            batchTolerance: 80,
            concurrentPipelines: {
              amount: 10,
              rejectOnFailure: true,
            },
            ttl: 3600,
            progressVerbosityLevel: 'info',
          },
          priority: 3,
          experimentName: 'main',
        },
        {
          modified: 1669625792673,
          name: 'batch_trigger',
          kind: 'batch',
          nodes: [
            {
              nodeName: 'count',
              algorithmName: 'eval-alg',
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              batchOperation: 'indexed',
              ttl: 0,
              input: [],
              kind: 'algorithm',
            },
          ],
          options: {
            batchTolerance: 100,
            progressVerbosityLevel: 'debug',
            ttl: 3600,
          },
          experimentName: 'main',
          priority: 3,
          triggers: {
            cron: {
              enabled: false,
              pattern: '0 * * * *',
            },
          },
        },
        {
          modified: 1666510863366,
          name: 'testFlowinput',
          kind: 'batch',
          flowInput: {
            test: 1,
            glik: 'ziv',
          },
          nodes: [
            {
              nodeName: 'fghfghfgh',
              algorithmName: 'alg1-ttt',
              retry: {
                policy: 'OnCrash',
                limit: 3,
              },
              batchOperation: 'indexed',
              ttl: 0,
              includeInResult: false,
              metrics: {
                tensorboard: true,
              },
              input: [],
              kind: 'algorithm',
            },
          ],
          triggers: {
            cron: {
              enabled: false,
              pattern: '0 * * * *',
            },
          },
          options: {
            batchTolerance: 80,
            concurrentPipelines: {
              amount: 10,
              rejectOnFailure: true,
            },
            ttl: 3600,
            progressVerbosityLevel: 'info',
          },
          priority: 3,
          experimentName: 'main',
        },
      ],
      pipelinesCount: 120,
    },
  },
};

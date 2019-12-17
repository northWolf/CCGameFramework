// import BaseRecorder from "../../../game_framework/sdk/base/BaseRecorder";
// import {ItemState} from "../../tools/Define";
//
//
// export default class TTRecorder extends BaseRecorder {
//
//     protected isSave: boolean = true;
//
//     constructor() {
//         super();
//         this.recorder = tt.getGameRecorderManager();
//         this.recorder.onStart(res => {
//             console.log('录屏开始', res);
//             this.changeState(ItemState.GOT)
//             // do somethine;
//         })
//         this.recorder.onStop(res => {
//             // console.log(res.videoPath);
//             // do somethine;
//             console.log('录屏结束', res);
//             this.clipVideo(res, [15, 0], (r) => {
//                 if (r) {
//                     // if (this.isSave) {
//                     this.videoPath = r.videoPath
//                     // }
//                 } else {
//                     this.videoPath = null;
//                 }
//
//                 this.changeState(ItemState.NOT_GET)
//             })
//         })
//
//         this.recorder.onResume(() => {
//             console.log('TTRecorder onResume');
//         })
//         this.recorder.onPause(() => {
//             console.log('TTRecorder onPuase');
//         })
//
//         this.recorder.onError((res) => {
//             console.log('TTRecorder onPuase');
//             this.videoPath = null;
//         })
//     }
//
//
//     clipVideo(res, timeRange, func: Function) {
//         this.recorder.clipVideo({
//             path: res.videoPath,
//             timeRange: timeRange,
//             success: (r) => {
//                 console.log(r.videoPath);
//                 func(r)
//             },
//             fail: () => {
//                 func(null)
//             }
//         })
//     }
//
//
//     recordClip(func) {
//         this.recorder.recordClip({
//             timeRange: [15, 0],
//             success: (r) => {
//                 console.log(r.index)  // 裁剪唯一索引
//
//                 func(r)
//             }
//         })
//     }
//
//     start() {
//         if (this.isOpen()) {
//             return;
//         }
//         // this.changeState(ItemState.GOT)
//         this.recorder.start({
//             duration: 300,
//         })
//     }
//
//
//     stop(isSave: boolean = true) {
//         if (this.isClose()) {
//             return;
//         }
//         // this.changeState(ItemState.NOT_GET)
//         this.isSave = isSave;
//         this.recorder.stop();
//     }
//
//     pause() {
//         this.recorder.pause();
//     }
//
//     resume() {
//         this.recorder.resume();
//     }
//
// }

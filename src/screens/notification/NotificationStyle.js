import {StyleSheet} from 'react-native';
import {windowWidth} from '../../utils/Dimensions';

const styles = StyleSheet.create({
  /* Header */
  mainView: {
    flexDirection: 'row',
    marginTop: 0,
    height: 100,
    backgroundColor: '#FFF',
    elevation: 10,
  },
  firstView: {
    flex: 1,
    justifyContent: 'center',
  },
  secondView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateTextView: {
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 5,
    padding: 4,
  },
  tradeTextView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  tradeText: {
    color: '#000',
    fontSize: 15,
    fontWeight: '700',
  },
  tradeText1: {
    color: 'green',
    fontSize: 17,
    fontWeight: '800',
  },
  tradeText2: {
    color: 'purple',
    fontSize: 10,
    fontWeight: '700',
  },
  logoImg: {
    width: 150,
    height: 50,
    marginLeft: 10,
  },
  calenderStyle: {
    borderColor: '#00b050',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  calenderImage: {
    height: 25,
    width: 30,
  },
  calenderText: {
    color: '#000',
  },
  calender: {
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 2,
    marginRight: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
  },
  centeredView: {
    backgroundColor: 'gray',
    backfaceVisibility: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  modalView: {
    height: 400,
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 40,
    alignItems: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 10,
      height: 20,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 5,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: 'green',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    marginHorizontal: 20,
    color: '#000',
    fontSize: 15,
    fontWeight: '600',
  },
  modalText1: {
    marginBottom: 15,
    textAlign: 'center',
    marginHorizontal: 20,
    color: 'green',
    fontSize: 16,
    fontWeight: '800',
  },

  //Component Css
  container: {
    flex: 1,
  },
  hello: {
    alignItems: 'center',
  },
  helloText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '700',
  },
  direction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  d1: {flex: 7, justifyContent: 'center'},
  d2: {flex: 1, justifyContent: 'center'},
  uploadText: {color: '#000', fontWeight: '500'},
  uploadImage: {color: '#000'},
  //Scroll Start
  listMainView: {
    marginVertical: 5,
    marginHorizontal: 2,
    borderBottomColor: '#000',
  },

  //trade component

  bgarea: {
    // margin: 5,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  bgText: {
    backgroundColor: '#a82682',
    color: '#fff',
    paddingHorizontal: 3,
    paddingVertical: 2,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  bgarea3: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginVertical: 5,
    //marginHorizontal: 5,
  },
  bgarea2: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 5,
    justifyContent: 'center',
  },

  buy: {
    backgroundColor: '#00b050',
    color: '#000',
    paddingHorizontal: 3,
    fontWeight: '500',
  },
  notbuy1: {
    fontSize: 12,
    color: '#000',
    paddingHorizontal: 6,
    fontWeight: '600',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  notbuy: {
    fontSize: 13,
    color: '#000',
    padding: 3,
    fontWeight: '600',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  circle1: {
    margin: 3,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 10, height: 10},
    shadowOpacity: 1,
    shadowRadius: 50,
    elevation: 5,
  },
  circle: {
    margin: 3,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 10, height: 10},
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 5,
  },
  botomview1: {
    flex: 2,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  botomview2: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  botomview3: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  botomview4: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  bottomText: {
    color: '#000',
    fontWeight: '400',
    fontSize: 13,
  },
  bottomText1: {
    color: '#000',
    fontWeight: '400',
    fontSize: 13,
  },
  dateText: {
    fontSize: 10,
    color: 'gray',
  },

  showView: {flexDirection: 'row', marginVertical: 10},
  insideViewOne: {flex: 2, marginLeft: 5},
  dropTextOne: {color: '#000', fontSize: 12},
  insideViewTwo: {
    flex: 1,
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  //image component
  subView: {
    backgroundColor: '#fff',
  },
  imageView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 330,
    height: 300,
  },

  imageGraph: {
    width: 320,
    height: 280,
  },
  textView: {
    margin: 2,
  },
  headText: {
    color: '#000',
    fontWeight: '500',
  },
  SimpleText: {
    color: '#000',
  },
});
export {styles};

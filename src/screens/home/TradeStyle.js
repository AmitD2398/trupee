import {StyleSheet} from 'react-native';
import {windowWidth} from '../../utils/Dimensions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: windowWidth,
  },
  bgarea: {
    margin: 5,
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
    marginHorizontal: 5,
  },
  bgarea2: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 5,
    marginHorizontal: 4,
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
    margin: 5,
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
    margin: 5,
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

  showView: {
    flexDirection: 'row',
    marginVertical: 10,
    backgroundColor: '#d3d3d3',
    padding: 10,
  },
  insideViewOne: {flex: 2, marginLeft: 5},
  dropTextOne: {color: '#000', fontSize: 12},
  insideViewTwo: {
    flex: 1,
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  refreshView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
  },
  refreshTouch: {
    backgroundColor: 'green',
    borderRadius: 20,
  },
  refreshText: {
    color: '#FFF',
    fontWeight: '700',
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  no_recored_found_text: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
  },
});
export {styles};

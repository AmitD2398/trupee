import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import {List} from 'react-native-paper';
import axiosConfig from '../../../axiosConfig';

const Faqs = () => {
  const [expanded, setExpanded] = useState(false);
  const [faq, setFaq] = useState([]);

  const getFaq = () => {
    axiosConfig
      .get(`/faq_list`)
      .then(response => {
        console.log(response.data.data);
        setFaq(response.data.data);
      })
      .catch(error => {
        console.log(error);
      });
  };
  useEffect(() => {
    getFaq();
  }, []);

  const handlePress = () => setExpanded(!expanded);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View>
          <List.Section>
            {faq?.map(question => (
              <List.Accordion
                key={question._id}
                title={question?.title}
                titleNumberOfLines={5}>
                <List.Item
                  description={question?.desc}
                  descriptionNumberOfLines={15}
                />
              </List.Accordion>
            ))}
          </List.Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Faqs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

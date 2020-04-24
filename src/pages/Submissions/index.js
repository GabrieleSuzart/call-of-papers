import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import Event from '../Events/Event'
import SubmissionsTable from './SubmissionsTable'
import SubmissionsPending from './SubmissionsPending'
import { getUserIsOwner } from '../../utils/getUserIsOwner '
import { getEnvironment } from '../../utils/environment'
import { Row, Card, Col, Button } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink } from '@fortawesome/free-solid-svg-icons'
import { copyToCliboard } from '../../utils/copyToCliboard'

const environment = getEnvironment()

const Submissions = () => {
  const { eventId } = useParams()
  const [event, setEvent] = useState({})
  const [lectures, setLectures] = useState([])
  const [isOwner, setIsOwner] = useState(false)
  // const [aprovadas, setAprovadas] = useState([])
  // const [lecturesPending, setLecturesPending] = useState([])

  useEffect(() => {
    fetch(`${environment}/events/${eventId}`)
      .then(res => res.json())
      .then(data => setEvent(data))
      .catch(err => console.error(err, 'Nenhum evento por aqui!'))
  }, [eventId])

  useEffect(() => {
    eventId && getLectures()
  }, [eventId])

  useEffect(() => {
    setIsOwner(getUserIsOwner(event.userId))
  }, [event.userId])

  const getLectures = () => {
    fetch(`${environment}/lectures`)
      .then(res => res.json())
      .then(response => {
        let lecturesById = response.filter(lecture => lecture.eventId.string === eventId.string)
        setLectures(lecturesById)
      })
      .catch(err => console.error(err, 'Nenhuma palestra por aqui!'))
        // let lecturesById = response.filter(lecture => lecture.eventId.string === eventId.string)
        // setAprovadas(lecturesById.filter(lecture => lecture.status === 'APROVADA'))
        // setLecturesPending(lecturesById.filter(lecture => lecture.status === 'EM ANÁLISE'))
  }

  const handleUpdateLecture = () => {
    getLectures()
  }

  return (
    <div>
      <Event event={event} />
      {
        isOwner ?
          <>
            {
              lectures.length === 0 ?
                (
                  <Row style={{ marginTop: '20px' }}>
                    <Col span={16} offset={4} justify="center">
                      <Card style={{ textAlign: 'center' }}>
                        <p>Quando os palestrantes submeterem as palestas, você poderá gerenciá-las aqui.</p>
                        <p>Compartilhe o link do seu evento para realizar o Call of Papers.</p>
                        <Button type="link" onClick={() => copyToCliboard()} style={{ padding: 0 }}>
                          <FontAwesomeIcon icon={faLink} />Copiar link para Call of Papers
                        </Button>
                      </Card>
                    </Col>
                  </Row>
                )
                :
                (
                  <>
                    <SubmissionsTable lectures={lectures} />
                    <SubmissionsPending lectures={lectures} handleUpdateLecture={handleUpdateLecture} />
                  </>
                )
            }
          </>
          :
          ''
      }

    </div>
  )
}

export default Submissions
